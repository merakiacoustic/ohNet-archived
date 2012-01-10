#!/usr/bin/env python
import os, subprocess
from optparse import OptionParser
from Helpers.valgrind_parser import *
from Helpers.remote import *
import sys

class PostActions():
	def valgrind_parse(self):
		val = valgrindParser()
		val.get_files('vgout')
		val.parse_file()

	def do_release(self,platform):
		rem = remote()
		release_targets = []
		release_targets.append('release')
		release_targets.append('debug')

	def gen_docs(self):
		rem = remote()
		ret = subprocess.check_call('make docs', shell=True)

		if ret != 0:
			print ret
			sys.exit(10)

		rem.rsync('hudson-zapp','ohnet.linn.co.uk','Build/Docs/','~/doc')
		if ret != 0:
			print ret
			sys.exit(10)

		rem.rsync('hudson-rsync','openhome.org','Build/Docs/','~/build/nightly/docs')
		if ret != 0:
			print ret
			sys.exit(10)

	def arm_tests(self,type):
		rem = remote()
		ret = rem.rsync('root','sheeva010.linn.co.uk','Build','~/')

		if ret != 0:
			print ret
			sys.exit(10)

		ret = rem.rsync('root','sheeva010.linn.co.uk','AllTests.py','~/')

		if ret != 0:
			print ret
			sys.exit(10)

		
		if type == 'nightly':
			ret = rem.rssh('root','sheeva010.linn.co.uk','python AllTests.py -f -t')			

			if ret != 0:
				print ret
				sys.exit(10)
		else:
			ret = rem.rssh('root','sheeva010.linn.co.uk','python AllTests.py -t')
			if ret != 0:
				print ret
				sys.exit(10)		
	
class JenkinsBuild():
	def get_options(self):
		env_platform = os.environ.get('PLATFORM')
		env_nightly = os.environ.get('NIGHTLY')
		env_release = os.environ.get('RELEASE')
		env_version = os.environ.get('RELEASE_VERSION')

		parser = OptionParser()
		parser.add_option("-p", "--platform", dest="platform",
			help="linux-x86, linux-x64, windows-x86, windows-x64, arm")
		parser.add_option("-n", "--nightly",
                  action="store_true", dest="nightly", default=False,
                  help="Perform a nightly build")
		parser.add_option("-r", "--release",
		  action="store_true", dest="release", default=False,
		  help="publish release")
		parser.add_option("-v", "--version", dest="version",
			help="version number for release")
		(self.options, self.args) = parser.parse_args()
		
		# check if env variables are set
		# if they are, ignore what is on the command line.

		if env_platform != None:
			self.options.platform = env_platform

                if env_version != None:
                        self.options.version = env_version
		
		if env_nightly == 'true' or self.options.nightly == True:
			 self.options.nightly = '1'
		else:
			self.options.nightly = '0'

		if env_release == 'true' or self.options.release == True:
			print "enabling nightly build as release is enabled"
			self.options.release = '1'
			self.options.nightly = '1'

		else:
			self.options.release = '0'

		print "options for build are nightly:%s and release:%s on platform %s" %(self.options.nightly,self.options.release,self.options.platform)

	def get_platform(self):
		
		platforms = { 
		'linux-x86': { 'os':'linux', 'arch':'x86'},
		'linux-x64': { 'os':'linux', 'arch':'x64'},
		'windows-x86': { 'os': 'windows', 'arch':'x86'},
		'windows-x64': { 'os': 'windows', 'arch':'x64'},
		'macos-x64': { 'os': 'macos', 'arch':'x86'},
		'arm': { 'os': 'linux', 'arch': 'arm'},
		 }
		
		current_platform = self.options.platform
		self.platform = platforms[current_platform]

	def set_platform_args(self):
		os_platform = self.platform['os']
		arch = self.platform['arch']
		args=[]
		
		if os_platform == 'windows' and arch == 'x86':
			args.append('vcvarsall.bat')
		if os_platform == 'windows' and arch == 'x64':
			args.append('vcvarsall.bat')
			args.append('amd64')
			os.environ['CS_PLATFORM'] = 'x64'
		if arch == 'arm':
			os.environ['CROSS_COMPILE'] = 'arm-none-linux-gnueabi-'

		self.platform_args = args

	def get_build_args(self):
		nightly = self.options.nightly
		arch = self.platform['arch']
		os_platform = self.platform['os']
		args=[]
		args.append('python')
		args.append('AllTests.py')
		args.append('--silent')

		if arch == 'arm':
			args.append('--buildonly')
		elif arch == 'x64':
			args.append('--native')
		if os_platform == 'macos':
			args.append('--buildonly')
		if os_platform == 'windows' and arch == 'x86':
			args.append('--js')
			args.append('--java')
		if os_platform == 'linux' and arch == 'x86':
			args.append('--java')
		if nightly == '1':
			args.append('--full')
			if os_platform == 'linux' and arch == 'x86':
				args.append('--valgrind')	
		self.build_args = args

	def do_build(self):
		nightly = self.options.nightly
		release = self.options.release

		os_platform = self.platform['os']
		build_args = self.build_args
		platform_args = self.platform_args

		build = []
			
		if platform_args == []:
			build.extend(build_args)

		else:
			build.extend(platform_args)
			build.append('&&')
			build.extend(build_args)
			
		build_targets = []
		build_targets.append('debug')

		if release == '1':
			build_targets.append('release')

		for build_t in build_targets:
			if build_t == 'release':
				build.append('--release')
				build.append('--incremental')

			print 'running build with %s' %(build,)

			ret = subprocess.check_call(build)			
			if ret != 0:
				print ret
				sys.exit(10)

	def do_release(self):
		nightly = self.options.nightly
		release = self.options.release
		platform_args = self.platform_args
		platform = self.options.platform
		version = self.options.version
		
		rem = remote()

		release_targets = []
		release_targets.append('release')
		release_targets.append('debug')
		
		for release in release_targets:
			release_args = []
			release_args.append('make')
			release_args.append('bundle-dev')
			release_args.append('targetplatform=%s' %(platform,))
			release_args.append('releasetype=%s' %(release,))
		
			build = []
	
			if platform_args == []:
				 build.append('make')
				 build.append('bundle-dev')
				 build.append('targetplatform=%s' %(platform,))
				 build.append('releasetype=%s' %(release,))

			else:
				build.extend(platform_args)
				build.append('&&')
                                build.append('make')
				build.append('bundle-dev')
				build.append('targetplatform=%s' %(platform,))
				build.append('releasetype=%s' %(release,))

			print "doing release with bundle %s" %(build,)

	#		ret = subprocess.check_call(build)
        #                if ret != 0:
	#			print ret
	#			sys.exit(10)

			bundle_name = os.path.join('Build/Bundles',"ohNet-%s-%s-dev.tar.gz" %(platform,release))		
			os.rename(bundle_name,os.path.join('Build/Bundles',"ohNet-%s-%s-dev-%s.tar.gz" %(version,platform,release)))

	
	def do_postAction(self):
		nightly = self.options.nightly
		release = self.options.release
		os_platform = self.platform['os']
		arch = self.platform['arch']
		postAction = PostActions()

		if nightly == '1':
			if os_platform == 'linux' and arch == 'x86':
				postAction.valgrind_parse()
				#postAction.gen_docs()

			if os_platform == 'linux' and arch == 'arm':
				postAction.arm_tests('nightly')
		else:
			if os_platform == 'linux' and arch == 'arm':
				postAction.arm_tests('commit')	


		if os_platform != 'macos' and release == '1':
				self.do_release()
def main():
	Build = JenkinsBuild()
	Build.get_options()
	Build.get_platform()
	Build.set_platform_args()
	Build.get_build_args()
#	Build.do_build()
	Build.do_postAction()

if __name__ == "__main__":
	main()

