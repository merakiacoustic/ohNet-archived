var YUITest={version:"@VERSION@"};YUITest.EventTarget=function(){this._handlers={};};YUITest.EventTarget.prototype={constructor:YUITest.EventTarget,attach:function(A,B){if(typeof this._handlers[A]=="undefined"){this._handlers[A]=[];}this._handlers[A].push(B);},subscribe:function(A,B){this.attach.apply(this,arguments);},fire:function(D){if(typeof D=="string"){D={type:D};}if(!D.target){D.target=this;}if(!D.type){throw new Error("Event object missing 'type' property.");}if(this._handlers[D.type] instanceof Array){var B=this._handlers[D.type];for(var C=0,A=B.length;C<A;C++){B[C].call(this,D);}}},detach:function(D,E){if(this._handlers[D] instanceof Array){var B=this._handlers[D];for(var C=0,A=B.length;C<A;C++){if(B[C]===E){B.splice(C,1);break;}}}},unsubscribe:function(A,B){this.detach.apply(this,arguments);}};YUITest.Util={mix:function(B,A){for(var C in A){if(A.hasOwnProperty(C)){B[C]=A[C];}}return B;},JSON:typeof JSON!="undefined"?JSON:{stringify:function(){throw new Error("No JSON utility specified.");}}};YUITest.AssertionError=function(A){this.message=A;this.name="Assert Error";};YUITest.AssertionError.prototype={constructor:YUITest.AssertionError,getMessage:function(){return this.message;},toString:function(){return this.name+": "+this.getMessage();}};YUITest.ComparisonFailure=function(B,A,C){YUITest.AssertionError.call(this,B);this.expected=A;this.actual=C;this.name="ComparisonFailure";};YUITest.ComparisonFailure.prototype=new YUITest.AssertionError;YUITest.ComparisonFailure.prototype.constructor=YUITest.ComparisonFailure;YUITest.ComparisonFailure.prototype.getMessage=function(){return this.message+"\nExpected: "+this.expected+" ("+(typeof this.expected)+")"+"\nActual: "+this.actual+" ("+(typeof this.actual)+")";};YUITest.ShouldError=function(A){YUITest.AssertionError.call(this,A||"This test should have thrown an error but didn't.");this.name="ShouldError";};YUITest.ShouldError.prototype=new YUITest.AssertionError();YUITest.ShouldError.prototype.constructor=YUITest.ShouldError;YUITest.ShouldFail=function(A){YUITest.AssertionError.call(this,A||"This test should fail but didn't.");this.name="ShouldFail";};YUITest.ShouldFail.prototype=new YUITest.AssertionError();YUITest.ShouldFail.prototype.constructor=YUITest.ShouldFail;YUITest.UnexpectedError=function(A){YUITest.AssertionError.call(this,"Unexpected error: "+A.message);this.cause=A;this.name="UnexpectedError";this.stack=A.stack;};YUITest.UnexpectedError.prototype=new YUITest.AssertionError();YUITest.UnexpectedError.prototype.constructor=YUITest.UnexpectedError;YUITest.UnexpectedValue=function(B,A){YUITest.AssertionError.call(this,B);this.unexpected=A;this.name="UnexpectedValue";};YUITest.UnexpectedValue.prototype=new YUITest.AssertionError();YUITest.UnexpectedValue.prototype.constructor=YUITest.UnexpectedValue;YUITest.UnexpectedValue.prototype.getMessage=function(){return this.message+"\nUnexpected: "+this.unexpected+" ("+(typeof this.unexpected)+") ";};YUITest.Wait=function(B,A){this.segment=(typeof B=="function"?B:null);this.delay=(typeof A=="number"?A:0);};YUITest.Assert={_asserts:0,_formatMessage:function(B,A){if(typeof B=="string"&&B.length>0){return B.replace("{message}",A);}else{return A;}},_getCount:function(){return this._asserts;},_increment:function(){this._asserts++;},_reset:function(){this._asserts=0;},fail:function(A){throw new YUITest.AssertionError(YUITest.Assert._formatMessage(A,"Test force-failed."));},areEqual:function(B,C,A){YUITest.Assert._increment();if(B!=C){throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(A,"Values should be equal."),B,C);}},areNotEqual:function(A,C,B){YUITest.Assert._increment();if(A==C){throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(B,"Values should not be equal."),A);}},areNotSame:function(A,C,B){YUITest.Assert._increment();if(A===C){throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(B,"Values should not be the same."),A);}},areSame:function(B,C,A){YUITest.Assert._increment();if(B!==C){throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(A,"Values should be the same."),B,C);}},isFalse:function(B,A){YUITest.Assert._increment();if(false!==B){throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(A,"Value should be false."),false,B);}},isTrue:function(B,A){YUITest.Assert._increment();if(true!==B){throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(A,"Value should be true."),true,B);}},isNaN:function(B,A){YUITest.Assert._increment();if(!isNaN(B)){throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(A,"Value should be NaN."),NaN,B);}},isNotNaN:function(B,A){YUITest.Assert._increment();if(isNaN(B)){throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(A,"Values should not be NaN."),NaN);}},isNotNull:function(B,A){YUITest.Assert._increment();if(B===null){throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(A,"Values should not be null."),null);}},isNotUndefined:function(B,A){YUITest.Assert._increment();if(typeof B=="undefined"){throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(A,"Value should not be undefined."),undefined);}},isNull:function(B,A){YUITest.Assert._increment();if(B!==null){throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(A,"Value should be null."),null,B);}},isUndefined:function(B,A){YUITest.Assert._increment();if(typeof B!="undefined"){throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(A,"Value should be undefined."),undefined,B);}},isArray:function(C,B){YUITest.Assert._increment();var A=false;if(Array.isArray){A=!Array.isArray(C);}else{A=Object.prototype.toString.call(C)!="[object Array]";}if(A){throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(B,"Value should be an array."),C);}},isBoolean:function(B,A){YUITest.Assert._increment();if(typeof B!="boolean"){throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(A,"Value should be a Boolean."),B);}},isFunction:function(B,A){YUITest.Assert._increment();if(!(B instanceof Function)){throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(A,"Value should be a function."),B);
}},isInstanceOf:function(B,C,A){YUITest.Assert._increment();if(!(C instanceof B)){throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(A,"Value isn't an instance of expected type."),B,C);}},isNumber:function(B,A){YUITest.Assert._increment();if(typeof B!="number"){throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(A,"Value should be a number."),B);}},isObject:function(B,A){YUITest.Assert._increment();if(!B||(typeof B!="object"&&typeof B!="function")){throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(A,"Value should be an object."),B);}},isString:function(B,A){YUITest.Assert._increment();if(typeof B!="string"){throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(A,"Value should be a string."),B);}},isTypeOf:function(A,C,B){YUITest.Assert._increment();if(typeof C!=A){throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(B,"Value should be of type "+A+"."),A,typeof C);}},throwsError:function(D,E,C){YUITest.Assert._increment();var A=false;try{E();}catch(B){if(typeof D=="string"){if(B.message!=D){A=true;}}else{if(typeof D=="function"){if(!(B instanceof D)){A=true;}}else{if(typeof D=="object"&&D!==null){if(!(B instanceof D.constructor)||B.message!=D.message){A=true;}}else{A=true;}}}if(A){throw new YUITest.UnexpectedError(B);}else{return;}}throw new YUITest.AssertionError(YUITest.Assert._formatMessage(C,"Error should have been thrown."));}};YUITest.ArrayAssert={_indexOf:function(B,C){if(B.indexOf){return B.indexOf(C);}else{for(var A=0;A<B.length;A++){if(B[A]===C){return A;}}return -1;}},_some:function(B,C){if(B.some){return B.some(C);}else{for(var A=0;A<B.length;A++){if(C(B[A])){return true;}}return false;}},contains:function(C,B,A){YUITest.Assert._increment();if(this._indexOf(B,C)==-1){YUITest.Assert.fail(YUITest.Assert._formatMessage(A,"Value "+C+" ("+(typeof C)+") not found in array ["+B+"]."));}},containsItems:function(C,D,B){YUITest.Assert._increment();for(var A=0;A<C.length;A++){if(this._indexOf(D,C[A])==-1){YUITest.Assert.fail(YUITest.Assert._formatMessage(B,"Value "+C[A]+" ("+(typeof C[A])+") not found in array ["+D+"]."));}}},containsMatch:function(C,B,A){YUITest.Assert._increment();if(typeof C!="function"){throw new TypeError("ArrayAssert.containsMatch(): First argument must be a function.");}if(!this._some(B,C)){YUITest.Assert.fail(YUITest.Assert._formatMessage(A,"No match found in array ["+B+"]."));}},doesNotContain:function(C,B,A){YUITest.Assert._increment();if(this._indexOf(B,C)>-1){YUITest.Assert.fail(YUITest.Assert._formatMessage(A,"Value found in array ["+B+"]."));}},doesNotContainItems:function(C,D,B){YUITest.Assert._increment();for(var A=0;A<C.length;A++){if(this._indexOf(D,C[A])>-1){YUITest.Assert.fail(YUITest.Assert._formatMessage(B,"Value found in array ["+D+"]."));}}},doesNotContainMatch:function(C,B,A){YUITest.Assert._increment();if(typeof C!="function"){throw new TypeError("ArrayAssert.doesNotContainMatch(): First argument must be a function.");}if(this._some(B,C)){YUITest.Assert.fail(YUITest.Assert._formatMessage(A,"Value found in array ["+B+"]."));}},indexOf:function(E,D,A,C){YUITest.Assert._increment();for(var B=0;B<D.length;B++){if(D[B]===E){if(A!=B){YUITest.Assert.fail(YUITest.Assert._formatMessage(C,"Value exists at index "+B+" but should be at index "+A+"."));}return;}}YUITest.Assert.fail(YUITest.Assert._formatMessage(C,"Value doesn't exist in array ["+D+"]."));},itemsAreEqual:function(C,D,B){YUITest.Assert._increment();if(C.length!=D.length){YUITest.Assert.fail(YUITest.Assert._formatMessage(B,"Array should have a length of "+C.length+" but has a length of "+D.length));}for(var A=0;A<C.length;A++){if(C[A]!=D[A]){throw new YUITest.Assert.ComparisonFailure(YUITest.Assert._formatMessage(B,"Values in position "+A+" are not equal."),C[A],D[A]);}}},itemsAreEquivalent:function(D,E,A,C){YUITest.Assert._increment();if(typeof A!="function"){throw new TypeError("ArrayAssert.itemsAreEquivalent(): Third argument must be a function.");}if(D.length!=E.length){YUITest.Assert.fail(YUITest.Assert._formatMessage(C,"Array should have a length of "+D.length+" but has a length of "+E.length));}for(var B=0;B<D.length;B++){if(!A(D[B],E[B])){throw new YUITest.Assert.ComparisonFailure(YUITest.Assert._formatMessage(C,"Values in position "+B+" are not equivalent."),D[B],E[B]);}}},isEmpty:function(B,A){YUITest.Assert._increment();if(B.length>0){YUITest.Assert.fail(YUITest.Assert._formatMessage(A,"Array should be empty."));}},isNotEmpty:function(B,A){YUITest.Assert._increment();if(B.length===0){YUITest.Assert.fail(YUITest.Assert._formatMessage(A,"Array should not be empty."));}},itemsAreSame:function(C,D,B){YUITest.Assert._increment();if(C.length!=D.length){YUITest.Assert.fail(YUITest.Assert._formatMessage(B,"Array should have a length of "+C.length+" but has a length of "+D.length));}for(var A=0;A<C.length;A++){if(C[A]!==D[A]){throw new YUITest.Assert.ComparisonFailure(YUITest.Assert._formatMessage(B,"Values in position "+A+" are not the same."),C[A],D[A]);}}},lastIndexOf:function(E,D,A,C){for(var B=D.length;B>=0;B--){if(D[B]===E){if(A!=B){YUITest.Assert.fail(YUITest.Assert._formatMessage(C,"Value exists at index "+B+" but should be at index "+A+"."));}return;}}YUITest.Assert.fail(YUITest.Assert._formatMessage(C,"Value doesn't exist in array."));}};YUITest.ObjectAssert={areEqual:function(C,D,B){YUITest.Assert._increment();for(var A in C){if(C.hasOwnProperty(A)){if(C[A]!=D[A]){throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(B,"Values should be equal for property "+A),C[A],D[A]);}}}},hasKey:function(A,B,C){YUITest.ObjectAssert.ownsOrInheritsKey(A,B,C);},hasKeys:function(B,A,C){YUITest.ObjectAssert.ownsOrInheritsKeys(B,objects,C);},inheritsKey:function(A,B,C){YUITest.Assert._increment();if(!(A in B&&!B.hasOwnProperty(A))){YUITest.Assert.fail(YUITest.Assert._formatMessage(C,"Property '"+A+"' not found on object instance."));}},inheritsKeys:function(C,A,D){YUITest.Assert._increment();for(var B=0;B<C.length;B++){if(!(propertyName in A&&!A.hasOwnProperty(C[B]))){YUITest.Assert.fail(YUITest.Assert._formatMessage(D,"Property '"+C[B]+"' not found on object instance."));
}}},ownsKey:function(A,B,C){YUITest.Assert._increment();if(!B.hasOwnProperty(A)){YUITest.Assert.fail(YUITest.Assert._formatMessage(C,"Property '"+A+"' not found on object instance."));}},ownsKeys:function(C,A,D){YUITest.Assert._increment();for(var B=0;B<C.length;B++){if(!A.hasOwnProperty(C[B])){YUITest.Assert.fail(YUITest.Assert._formatMessage(D,"Property '"+C[B]+"' not found on object instance."));}}},ownsNoKeys:function(B,D){YUITest.Assert._increment();var C=0,A;for(A in B){if(B.hasOwnProperty(A)){C++;}}if(C!==0){YUITest.Assert.fail(YUITest.Assert._formatMessage(D,"Object owns "+C+" properties but should own none."));}},ownsOrInheritsKey:function(A,B,C){YUITest.Assert._increment();if(!(A in B)){YUITest.Assert.fail(YUITest.Assert._formatMessage(C,"Property '"+A+"' not found on object."));}},ownsOrInheritsKeys:function(C,A,D){YUITest.Assert._increment();for(var B=0;B<C.length;B++){if(!(C[B] in A)){YUITest.Assert.fail(YUITest.Assert._formatMessage(D,"Property '"+C[B]+"' not found on object."));}}}};YUITest.DateAssert={datesAreEqual:function(B,D,A){YUITest.Assert._increment();if(B instanceof Date&&D instanceof Date){var C="";if(B.getFullYear()!=D.getFullYear()){C="Years should be equal.";}if(B.getMonth()!=D.getMonth()){C="Months should be equal.";}if(B.getDate()!=D.getDate()){C="Days of month should be equal.";}if(C.length){throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(A,C),B,D);}}else{throw new TypeError("YUITest.DateAssert.datesAreEqual(): Expected and actual values must be Date objects.");}},timesAreEqual:function(B,D,A){YUITest.Assert._increment();if(B instanceof Date&&D instanceof Date){var C="";if(B.getHours()!=D.getHours()){C="Hours should be equal.";}if(B.getMinutes()!=D.getMinutes()){C="Minutes should be equal.";}if(B.getSeconds()!=D.getSeconds()){C="Seconds should be equal.";}if(C.length){throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(A,C),B,D);}}else{throw new TypeError("YUITest.DateAssert.timesAreEqual(): Expected and actual values must be Date objects.");}}};YUITest.Mock=function(D){D=D||{};var A,B;try{function E(){}E.prototype=D;A=new E();}catch(C){A={};}for(B in D){if(D.hasOwnProperty(B)){if(typeof D[B]=="function"){A[B]=function(F){return function(){YUITest.Assert.fail("Method "+F+"() was called but was not expected to be.");};}(B);}}}return A;};YUITest.Mock.expect=function(F,B){if(!F.__expectations){F.__expectations={};}if(B.method){var A=B.method,G=B.args||[],I=B.returns,E=(typeof B.callCount=="number")?B.callCount:1,H=B.error,C=B.run||function(){},D;F.__expectations[A]=B;B.callCount=E;B.actualCallCount=0;for(D=0;D<G.length;D++){if(!(G[D] instanceof YUITest.Mock.Value)){G[D]=YUITest.Mock.Value(YUITest.Assert.areSame,[G[D]],"Argument "+D+" of "+A+"() is incorrect.");}}if(E>0){F[A]=function(){try{B.actualCallCount++;YUITest.Assert.areEqual(G.length,arguments.length,"Method "+A+"() passed incorrect number of arguments.");for(var L=0,J=G.length;L<J;L++){G[L].verify(arguments[L]);}C.apply(this,arguments);if(H){throw H;}}catch(K){YUITest.TestRunner._handleError(K);}return I;};}else{F[A]=function(){try{YUITest.Assert.fail("Method "+A+"() should not have been called.");}catch(J){YUITest.TestRunner._handleError(J);}};}}else{if(B.property){F.__expectations[A]=B;}}};YUITest.Mock.verify=function(A){try{for(var C in A.__expectations){if(A.__expectations.hasOwnProperty(C)){var B=A.__expectations[C];if(B.method){YUITest.Assert.areEqual(B.callCount,B.actualCallCount,"Method "+B.method+"() wasn't called the expected number of times.");}else{if(B.property){YUITest.Assert.areEqual(B.value,A[B.property],"Property "+B.property+" wasn't set to the correct value.");}}}}}catch(D){YUITest.TestRunner._handleError(D);}};YUITest.Mock.Value=function(C,A,B){if(this instanceof YUITest.Mock.Value){this.verify=function(E){var D=[].concat(A||[]);D.push(E);D.push(B);C.apply(null,D);};}else{return new YUITest.Mock.Value(C,A,B);}};YUITest.Mock.Value.Any=YUITest.Mock.Value(function(){});YUITest.Mock.Value.Boolean=YUITest.Mock.Value(YUITest.Assert.isBoolean);YUITest.Mock.Value.Number=YUITest.Mock.Value(YUITest.Assert.isNumber);YUITest.Mock.Value.String=YUITest.Mock.Value(YUITest.Assert.isString);YUITest.Mock.Value.Object=YUITest.Mock.Value(YUITest.Assert.isObject);YUITest.Mock.Value.Function=YUITest.Mock.Value(YUITest.Assert.isFunction);YUITest.TestCase=function(A){this._should={};for(var B in A){this[B]=A[B];}if(typeof this.name!="string"){this.name="testCase"+(+new Date());}};YUITest.TestCase.prototype={constructor:YUITest.TestCase,resume:function(A){YUITest.TestRunner.resume(A);},wait:function(B,A){A=(typeof A=="number"?A:10000);if(typeof B=="function"){throw new YUITest.Wait(B,A);}else{throw new YUITest.Wait(function(){YUITest.Assert.fail("Timeout: wait() called but resume() never called.");},A);}},assert:function(B,A){YUITest.Assert._increment();if(!B){throw new YUITest.AssertionError(YUITest.Assert._formatMessage(A,"Assertion failed."));}},fail:function(A){YUITest.Assert.fail(A);},setUp:function(){},tearDown:function(){}};YUITest.TestSuite=function(A){this.name="";this.items=[];if(typeof A=="string"){this.name=A;}else{if(A instanceof Object){for(var B in A){if(A.hasOwnProperty(B)){this[B]=A[B];}}}}if(this.name===""){this.name="testSuite"+(+new Date());}};YUITest.TestSuite.prototype={constructor:YUITest.TestSuite,add:function(A){if(A instanceof YUITest.TestSuite||A instanceof YUITest.TestCase){this.items.push(A);}return this;},setUp:function(){},tearDown:function(){}};YUITest.TestFormat=function(){function A(B){return B.replace(/[<>"'&]/g,function(C){switch(C){case"<":return"&lt;";case">":return"&gt;";case'"':return"&quot;";case"'":return"&apos;";case"&":return"&amp;";}});}return{JSON:function(B){return YUITest.Util.JSON.stringify(B);},XML:function(C){function B(E){var D="<"+E.type+' name="'+A(E.name)+'"';if(typeof(E.duration)=="number"){D+=' duration="'+E.duration+'"';}if(E.type=="test"){D+=' result="'+E.result+'" message="'+A(E.message)+'">';}else{D+=' passed="'+E.passed+'" failed="'+E.failed+'" ignored="'+E.ignored+'" total="'+E.total+'">';
for(var F in E){if(E.hasOwnProperty(F)){if(E[F]&&typeof E[F]=="object"&&!(E[F] instanceof Array)){D+=B(E[F]);}}}}D+="</"+E.type+">";return D;}return'<?xml version="1.0" encoding="UTF-8"?>'+B(C);},JUnitXML:function(B){function C(E){var D="";switch(E.type){case"test":if(E.result!="ignore"){D='<testcase name="'+A(E.name)+'" time="'+(E.duration/1000)+'">';if(E.result=="fail"){D+='<failure message="'+A(E.message)+'"><![CDATA['+E.message+"]]></failure>";}D+="</testcase>";}break;case"testcase":D='<testsuite name="'+A(E.name)+'" tests="'+E.total+'" failures="'+E.failed+'" time="'+(E.duration/1000)+'">';for(var F in E){if(E.hasOwnProperty(F)){if(E[F]&&typeof E[F]=="object"&&!(E[F] instanceof Array)){D+=C(E[F]);}}}D+="</testsuite>";break;case"testsuite":for(var F in E){if(E.hasOwnProperty(F)){if(E[F]&&typeof E[F]=="object"&&!(E[F] instanceof Array)){D+=C(E[F]);}}}break;case"report":D="<testsuites>";for(var F in E){if(E.hasOwnProperty(F)){if(E[F]&&typeof E[F]=="object"&&!(E[F] instanceof Array)){D+=C(E[F]);}}}D+="</testsuites>";}return D;}return'<?xml version="1.0" encoding="UTF-8"?>'+C(B);},TAP:function(C){var D=1;function B(E){var F="";switch(E.type){case"test":if(E.result!="ignore"){F="ok "+(D++)+" - "+E.name;if(E.result=="fail"){F="not "+F+" - "+E.message;}F+="\n";}else{F="#Ignored test "+E.name+"\n";}break;case"testcase":F="#Begin testcase "+E.name+"("+E.failed+" failed of "+E.total+")\n";for(var G in E){if(E.hasOwnProperty(G)){if(E[G]&&typeof E[G]=="object"&&!(E[G] instanceof Array)){F+=B(E[G]);}}}F+="#End testcase "+E.name+"\n";break;case"testsuite":F="#Begin testsuite "+E.name+"("+E.failed+" failed of "+E.total+")\n";for(var G in E){if(E.hasOwnProperty(G)){if(E[G]&&typeof E[G]=="object"&&!(E[G] instanceof Array)){F+=B(E[G]);}}}F+="#End testsuite "+E.name+"\n";break;case"report":for(var G in E){if(E.hasOwnProperty(G)){if(E[G]&&typeof E[G]=="object"&&!(E[G] instanceof Array)){F+=B(E[G]);}}}}return F;}return"1.."+C.total+"\n"+B(C);}};}();YUITest.CoverageFormat={JSON:function(A){return YUITest.Util.JSON.stringify(A);},XdebugJSON:function(B){var A={};for(var C in B){if(B.hasOwnProperty(C)){A[C]=B[C].lines;}}return YUITest.Util.JSON.stringify(B);}};YUITest.Event=(function(){var I={click:1,dblclick:1,mouseover:1,mouseout:1,mousedown:1,mouseup:1,mousemove:1},H={keydown:1,keyup:1,keypress:1},C={blur:1,change:1,focus:1,resize:1,scroll:1,select:1},D={scroll:1,resize:1,reset:1,submit:1,change:1,select:1,error:1,abort:1,click:1,dblclick:1,mouseover:1,mouseout:1,mousedown:1,mouseup:1,mousemove:1,keydown:1,keyup:1,keypress:1},E,B;function G(O,S,N,L,U,K,J,T,Q,W,V){if(!O){throw new Error("simulateKeyEvent(): Invalid target.");}if(typeof S=="string"){S=S.toLowerCase();switch(S){case"textevent":S="keypress";break;case"keyup":case"keydown":case"keypress":break;default:throw new Error("simulateKeyEvent(): Event type '"+S+"' not supported.");}}else{throw new Error("simulateKeyEvent(): Event type must be a string.");}if(typeof N!="boolean"){N=true;}if(typeof L!="boolean"){L=true;}if(typeof U!="object"||U==null){U=window;}if(typeof K!="boolean"){K=false;}if(typeof J!="boolean"){J=false;}if(typeof T!="boolean"){T=false;}if(typeof Q!="boolean"){Q=false;}if(typeof W!="number"){W=0;}if(typeof V!="number"){V=0;}var R=null;if(typeof document.createEvent=="function"){try{R=document.createEvent("KeyEvents");R.initKeyEvent(S,N,L,U,K,J,T,Q,W,V);}catch(P){try{R=document.createEvent("Events");}catch(M){R=document.createEvent("UIEvents");}finally{R.initEvent(S,N,L);R.view=U;R.altKey=J;R.ctrlKey=K;R.shiftKey=T;R.metaKey=Q;R.keyCode=W;R.charCode=V;}}O.dispatchEvent(R);}else{if(typeof document.createEventObject!="undefined"){R=document.createEventObject();R.bubbles=N;R.cancelable=L;R.view=U;R.ctrlKey=K;R.altKey=J;R.shiftKey=T;R.metaKey=Q;R.keyCode=(V>0)?V:W;O.fireEvent("on"+S,R);}else{throw new Error("simulateKeyEvent(): No event simulation framework present.");}}}function A(T,Z,Q,N,a,S,P,O,M,K,L,J,X,V,R,U){if(!T){throw new Error("simulateMouseEvent(): Invalid target.");}if(typeof Z=="string"){Z=Z.toLowerCase();if(!I[Z]){throw new Error("simulateMouseEvent(): Event type '"+Z+"' not supported.");}}else{throw new Error("simulateMouseEvent(): Event type must be a string.");}if(typeof Q!="boolean"){Q=true;}if(typeof N!="boolean"){N=(Z!="mousemove");}if(typeof a!="object"||a!=null){a=window;}if(typeof S!="number"){S=1;}if(typeof P!="number"){P=0;}if(typeof O!="number"){O=0;}if(typeof M!="number"){M=0;}if(typeof K!="number"){K=0;}if(typeof L!="boolean"){L=false;}if(typeof J!="boolean"){J=false;}if(typeof X!="boolean"){X=false;}if(typeof V!="boolean"){V=false;}if(typeof R!="number"){R=0;}var W=null;if(typeof document.createEvent=="function"){W=document.createEvent("MouseEvents");if(W.initMouseEvent){W.initMouseEvent(Z,Q,N,a,S,P,O,M,K,L,J,X,V,R,U);}else{W=document.createEvent("UIEvents");W.initEvent(Z,Q,N);W.view=a;W.detail=S;W.screenX=P;W.screenY=O;W.clientX=M;W.clientY=K;W.ctrlKey=L;W.altKey=J;W.metaKey=V;W.shiftKey=X;W.button=R;W.relatedTarget=U;}if(U&&!W.relatedTarget){if(Z=="mouseout"){W.toElement=U;}else{if(Z=="mouseover"){W.fromElement=U;}}}T.dispatchEvent(W);}else{if(typeof document.createEventObject!="undefined"){W=document.createEventObject();W.bubbles=Q;W.cancelable=N;W.view=a;W.detail=S;W.screenX=P;W.screenY=O;W.clientX=M;W.clientY=K;W.ctrlKey=L;W.altKey=J;W.metaKey=V;W.shiftKey=X;switch(R){case 0:W.button=1;break;case 1:W.button=4;break;case 2:break;default:W.button=0;}W.relatedTarget=U;T.fireEvent("on"+Z,W);}else{throw new Error("simulateMouseEvent(): No event simulation framework present.");}}}function F(P,O,L,K,J,N){if(!P){throw new Error("simulateUIEvent(): Invalid target.");}if(typeof O=="string"){O=O.toLowerCase();if(!C[O]){throw new Error("simulateUIEvent(): Event type '"+O+"' not supported.");}}else{throw new Error("simulateUIEvent(): Event type must be a string.");}var M=null;if(typeof L!="boolean"){L=(O in D);}if(typeof K!="boolean"){K=(O=="submit");}if(typeof J!="object"||J!=null){J=window;}if(typeof N!="number"){N=1;
}if(typeof document.createEvent=="function"){M=document.createEvent("UIEvents");M.initUIEvent(O,L,K,J,N);P.dispatchEvent(M);}else{if(typeof document.createEventObject!="undefined"){M=document.createEventObject();M.bubbles=L;M.cancelable=K;M.view=J;M.detail=N;P.fireEvent("on"+O,M);}else{throw new Error("simulateUIEvent(): No event simulation framework present.");}}}E={simulate:function(L,K,J){J=J||{};if(I[K]){A(L,K,J.bubbles,J.cancelable,J.view,J.detail,J.screenX,J.screenY,J.clientX,J.clientY,J.ctrlKey,J.altKey,J.shiftKey,J.metaKey,J.button,J.relatedTarget);}else{if(H[K]){G(L,K,J.bubbles,J.cancelable,J.view,J.ctrlKey,J.altKey,J.shiftKey,J.metaKey,J.keyCode,J.charCode);}else{if(C[K]){F(L,K,J.bubbles,J.cancelable,J.view,J.detail);}else{throw new Error("simulate(): Event '"+K+"' can't be simulated.");}}}}};for(B in I){if(I.hasOwnProperty(B)){E[B]=(function(J){return function(L,K){K=K||{};A(L,J,K.bubbles,K.cancelable,K.view,K.detail,K.screenX,K.screenY,K.clientX,K.clientY,K.ctrlKey,K.altKey,K.shiftKey,K.metaKey,K.button,K.relatedTarget);};})(B);}}for(B in H){if(H.hasOwnProperty(B)){E[B]=(function(J){return function(L,K){K=K||{};G(L,J,K.bubbles,K.cancelable,K.view,K.ctrlKey,K.altKey,K.shiftKey,K.metaKey,K.keyCode,K.charCode);};})(B);}}for(B in C){if(C.hasOwnProperty(B)){E[B]=(function(J){return function(L,K){K=K||{};F(L,J,K.bubbles,K.cancelable,K.view,K.detail);};})(B);}}return E;})();YUITest.Reporter=function(A,B){this.url=A;this.format=B||Y.Test.Format.XML;this._fields=new Object();this._form=null;this._iframe=null;};YUITest.Reporter.prototype={constructor:YUITest.Reporter,addField:function(A,B){this._fields[A]=B;},clearFields:function(){this._fields=new Object();},destroy:function(){if(this._form){this._form.parentNode.removeChild(this._form);this._form=null;}if(this._iframe){this._iframe.parentNode.removeChild(this._iframe);this._iframe=null;}this._fields=null;},report:function(C){if(!this._form){this._form=document.createElement("form");this._form.method="post";this._form.style.visibility="hidden";this._form.style.position="absolute";this._form.style.top=0;document.body.appendChild(this._form);try{this._iframe=document.createElement('<iframe name="yuiTestTarget" />');}catch(B){this._iframe=document.createElement("iframe");this._iframe.name="yuiTestTarget";}this._iframe.src="javascript:false";this._iframe.style.visibility="hidden";this._iframe.style.position="absolute";this._iframe.style.top=0;document.body.appendChild(this._iframe);this._form.target="yuiTestTarget";}this._form.action=this.url;while(this._form.hasChildNodes()){this._form.removeChild(this._form.lastChild);}this._fields.results=this.format(C);this._fields.useragent=navigator.userAgent;this._fields.timestamp=(new Date()).toLocaleString();for(var E in this._fields){var D=this._fields[E];if(this._fields.hasOwnProperty(E)&&typeof D=="function"){var A=document.createElement("input");A.type="hidden";A.name=E;A.value=D;this._form.appendChild(A);}}delete this._fields.results;delete this._fields.useragent;delete this._fields.timestamp;if(arguments[1]!==false){this._form.submit();}}};YUITest.PageManager=YUITest.Util.mix(new YUITest.EventTarget(),{TEST_PAGE_BEGIN_EVENT:"testpagebegin",TEST_PAGE_COMPLETE_EVENT:"testpagecomplete",TEST_MANAGER_BEGIN_EVENT:"testmanagerbegin",TEST_MANAGER_COMPLETE_EVENT:"testmanagercomplete",_curPage:null,_frame:null,_timeoutId:0,_pages:[],_results:null,_handleTestRunnerComplete:function(A){this.fire(this.TEST_PAGE_COMPLETE_EVENT,{page:this._curPage,results:A.results});this._processResults(this._curPage,A.results);if(this._pages.length){this._timeoutId=setTimeout(function(){YUITest.TestManager._run();},1000);}else{this.fire(this.TEST_MANAGER_COMPLETE_EVENT,this._results);}},_processResults:function(C,A){var B=this._results;B.passed+=A.passed;B.failed+=A.failed;B.ignored+=A.ignored;B.total+=A.total;B.duration+=A.duration;if(A.failed){B.failedPages.push(C);}else{B.passedPages.push(C);}A.name=C;A.type="page";B[C]=A;},_run:function(){this._curPage=this._pages.shift();this.fire(this.TEST_PAGE_BEGIN_EVENT,this._curPage);this._frame.location.replace(this._curPage);},load:function(){if(parent.YUITest.PageManager!==this){parent.YUITest.PageManager.load();}else{if(this._frame){var A=this._frame.YUITest.TestRunner;A.subscribe(A.COMPLETE_EVENT,this._handleTestRunnerComplete,this,true);A.run();}}},setPages:function(A){this._pages=A;},start:function(){if(!this._initialized){if(!this._frame){var A=document.createElement("iframe");A.style.visibility="hidden";A.style.position="absolute";document.body.appendChild(A);this._frame=A.contentWindow||A.contentDocument.parentWindow;}this._initialized=true;}this._results={passed:0,failed:0,ignored:0,total:0,type:"report",name:"YUI Test Results",duration:0,failedPages:[],passedPages:[]};this.fire(this.TEST_MANAGER_BEGIN_EVENT,null);this._run();},stop:function(){clearTimeout(this._timeoutId);}});YUITest.TestRunner=function(){function B(C){this.testObject=C;this.firstChild=null;this.lastChild=null;this.parent=null;this.next=null;this.results={passed:0,failed:0,total:0,ignored:0,duration:0};if(C instanceof YUITest.TestSuite){this.results.type="testsuite";this.results.name=C.name;}else{if(C instanceof YUITest.TestCase){this.results.type="testcase";this.results.name=C.name;}}}B.prototype={appendChild:function(C){var D=new B(C);if(this.firstChild===null){this.firstChild=this.lastChild=D;}else{this.lastChild.next=D;this.lastChild=D;}D.parent=this;return D;}};function A(){YUITest.EventTarget.call(this);this.masterSuite=new YUITest.TestSuite("yuitests"+(new Date()).getTime());this._cur=null;this._root=null;this._log=true;this._waiting=false;this._running=false;this._lastResults=null;}A.prototype=YUITest.Util.mix(new YUITest.EventTarget(),{constructor:YUITest.TestRunner,TEST_CASE_BEGIN_EVENT:"testcasebegin",TEST_CASE_COMPLETE_EVENT:"testcasecomplete",TEST_SUITE_BEGIN_EVENT:"testsuitebegin",TEST_SUITE_COMPLETE_EVENT:"testsuitecomplete",TEST_PASS_EVENT:"pass",TEST_FAIL_EVENT:"fail",TEST_IGNORE_EVENT:"ignore",COMPLETE_EVENT:"complete",BEGIN_EVENT:"begin",_addTestCaseToTestTree:function(D,E){var F=D.appendChild(E),G,C;
for(G in E){if((G.indexOf("test")===0||G.indexOf(" ")>-1)&&typeof E[G]=="function"){F.appendChild(G);}}},_addTestSuiteToTestTree:function(C,F){var E=C.appendChild(F);for(var D=0;D<F.items.length;D++){if(F.items[D] instanceof YUITest.TestSuite){this._addTestSuiteToTestTree(E,F.items[D]);}else{if(F.items[D] instanceof YUITest.TestCase){this._addTestCaseToTestTree(E,F.items[D]);}}}},_buildTestTree:function(){this._root=new B(this.masterSuite);for(var C=0;C<this.masterSuite.items.length;C++){if(this.masterSuite.items[C] instanceof YUITest.TestSuite){this._addTestSuiteToTestTree(this._root,this.masterSuite.items[C]);}else{if(this.masterSuite.items[C] instanceof YUITest.TestCase){this._addTestCaseToTestTree(this._root,this.masterSuite.items[C]);}}}},_handleTestObjectComplete:function(C){if(typeof C.testObject=="object"&&C!==null){if(C.parent){C.parent.results.passed+=C.results.passed;C.parent.results.failed+=C.results.failed;C.parent.results.total+=C.results.total;C.parent.results.ignored+=C.results.ignored;C.parent.results[C.testObject.name]=C.results;}if(C.testObject instanceof YUITest.TestSuite){C.testObject.tearDown();C.results.duration=(new Date())-C._start;this.fire({type:this.TEST_SUITE_COMPLETE_EVENT,testSuite:C.testObject,results:C.results});}else{if(C.testObject instanceof YUITest.TestCase){C.results.duration=(new Date())-C._start;this.fire({type:this.TEST_CASE_COMPLETE_EVENT,testCase:C.testObject,results:C.results});}}}},_next:function(){if(this._cur===null){this._cur=this._root;}else{if(this._cur.firstChild){this._cur=this._cur.firstChild;}else{if(this._cur.next){this._cur=this._cur.next;}else{while(this._cur&&!this._cur.next&&this._cur!==this._root){this._handleTestObjectComplete(this._cur);this._cur=this._cur.parent;}this._handleTestObjectComplete(this._cur);if(this._cur==this._root){this._cur.results.type="report";this._cur.results.timestamp=(new Date()).toLocaleString();this._cur.results.duration=(new Date())-this._cur._start;this._lastResults=this._cur.results;this._running=false;this.fire({type:this.COMPLETE_EVENT,results:this._lastResults});this._cur=null;}else{this._cur=this._cur.next;}}}}return this._cur;},_run:function(){var E=false;var D=this._next();if(D!==null){this._running=true;this._lastResult=null;var C=D.testObject;if(typeof C=="object"&&C!==null){if(C instanceof YUITest.TestSuite){this.fire({type:this.TEST_SUITE_BEGIN_EVENT,testSuite:C});D._start=new Date();C.setUp();}else{if(C instanceof YUITest.TestCase){this.fire({type:this.TEST_CASE_BEGIN_EVENT,testCase:C});D._start=new Date();}}if(typeof setTimeout!="undefined"){setTimeout(function(){YUITest.TestRunner._run();},0);}else{this._run();}}else{this._runTest(D);}}},_resumeTest:function(H){var C=this._cur;this._waiting=false;if(!C){return;}var I=C.testObject;var F=C.parent.testObject;if(F.__yui_wait){clearTimeout(F.__yui_wait);delete F.__yui_wait;}var L=(F._should.fail||{})[I];var D=(F._should.error||{})[I];var G=false;var J=null;try{H.apply(F);if(YUITest.Assert._getCount()==0){throw new YUITest.AssertionError("Test has no asserts.");}else{if(L){J=new YUITest.ShouldFail();G=true;}else{if(D){J=new YUITest.ShouldError();G=true;}}}}catch(K){if(F.__yui_wait){clearTimeout(F.__yui_wait);delete F.__yui_wait;}if(K instanceof YUITest.AssertionError){if(!L){J=K;G=true;}}else{if(K instanceof YUITest.Wait){if(typeof K.segment=="function"){if(typeof K.delay=="number"){if(typeof setTimeout!="undefined"){F.__yui_wait=setTimeout(function(){YUITest.TestRunner._resumeTest(K.segment);},K.delay);this._waiting=true;}else{throw new Error("Asynchronous tests not supported in this environment.");}}}return;}else{if(!D){J=new YUITest.UnexpectedError(K);G=true;}else{if(typeof D=="string"){if(K.message!=D){J=new YUITest.UnexpectedError(K);G=true;}}else{if(typeof D=="function"){if(!(K instanceof D)){J=new YUITest.UnexpectedError(K);G=true;}}else{if(typeof D=="object"&&D!==null){if(!(K instanceof D.constructor)||K.message!=D.message){J=new YUITest.UnexpectedError(K);G=true;}}}}}}}}if(G){this.fire({type:this.TEST_FAIL_EVENT,testCase:F,testName:I,error:J});}else{this.fire({type:this.TEST_PASS_EVENT,testCase:F,testName:I});}F.tearDown();YUITest.Assert._reset();var E=(new Date())-C._start;C.parent.results[I]={result:G?"fail":"pass",message:J?J.getMessage():"Test passed",type:"test",name:I,duration:E};if(G){C.parent.results.failed++;}else{C.parent.results.passed++;}C.parent.results.total++;if(typeof setTimeout!="undefined"){setTimeout(function(){YUITest.TestRunner._run();},0);}else{this._run();}},_handleError:function(C){if(this._waiting){this._resumeTest(function(){throw C;});}else{throw C;}},_runTest:function(F){var C=F.testObject;var D=F.parent.testObject;var G=D[C];var E=(D._should.ignore||{})[C];if(E){F.parent.results[C]={result:"ignore",message:"Test ignored",type:"test",name:C};F.parent.results.ignored++;F.parent.results.total++;this.fire({type:this.TEST_IGNORE_EVENT,testCase:D,testName:C});if(typeof setTimeout!="undefined"){setTimeout(function(){YUITest.TestRunner._run();},0);}else{this._run();}}else{F._start=new Date();D.setUp();this._resumeTest(G);}},getName:function(){return this.masterSuite.name;},setName:function(C){this.masterSuite.name=C;},add:function(C){this.masterSuite.add(C);return this;},clear:function(){this.masterSuite=new YUITest.TestSuite("yuitests"+(new Date()).getTime());},isWaiting:function(){return this._waiting;},isRunning:function(){return this._running;},getResults:function(C){if(!this._running&&this._lastResults){if(typeof C=="function"){return C(this._lastResults);}else{return this._lastResults;}}else{return null;}},getCoverage:function(C){if(!this._running&&typeof _yuitest_coverage=="object"){if(typeof C=="function"){return C(_yuitest_coverage);}else{return _yuitest_coverage;}}else{return null;}},resume:function(C){if(this._waiting){this._resumeTest(C||function(){});}else{throw new Error("resume() called without wait().");}},run:function(C){var D=YUITest.TestRunner;if(!C&&this.masterSuite.items.length==1&&this.masterSuite.items[0] instanceof YUITest.TestSuite){this.masterSuite=this.masterSuite.items[0];
}D._buildTestTree();D._root._start=new Date();D.fire(D.BEGIN_EVENT);D._run();}});return new A();}();