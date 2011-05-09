#include <DviStack.h>
#include <Stack.h>
#include <DviServerUpnp.h>
#include <DviDevice.h>
#include <DviSubscription.h>
#include <Printer.h>
#include <DviServerWebSocket.h>
#include <Bonjour.h>
#include <MdnsProvider.h> // replace this to allow clients to set an alternative Bonjour implementation
#include <Core/DvDevice.h>
#include <Core/DvOpenhomeOrgOhNet1.h>

using namespace Zapp;

class Zapp::DvProviderOhNet : public DvProviderOpenhomeOrgOhNet1
{
public:
    DvProviderOhNet(DvDevice& aDevice, TUint aWebSocketPort);
private:
    void GetWebSocketPort(IInvocationResponse& aResponse, TUint aVersion, IInvocationResponseUint& aPort);
private:
    TUint iWebSocketPort;
};

DvProviderOhNet::DvProviderOhNet(DvDevice& aDevice, TUint aWebSocketPort)
    : DvProviderOpenhomeOrgOhNet1(aDevice)
    , iWebSocketPort(aWebSocketPort)
{
    EnableActionGetWebSocketPort();
}

void DvProviderOhNet::GetWebSocketPort(IInvocationResponse& aResponse, TUint /*aVersion*/, IInvocationResponseUint& aPort)
{
    aResponse.Start();
    aPort.Write(iWebSocketPort);
    aResponse.End();
}


// DviStack

DviStack::DviStack()
    : iBootId(1)
    , iNextBootId(2)
    , iMdns(NULL)
{
    Stack::SetDviStack(this);
    TUint port = (Stack::InitParams().DvIsBonjourEnabled()? 80 : 0);
    iDviServerUpnp = new DviServerUpnp(port);
    iDviDeviceMap = new DviDeviceMap;
    iSubscriptionManager = new DviSubscriptionManager;
    iDviServerWebSocket = new DviServerWebSocket;
    if (Stack::InitParams().DvIsBonjourEnabled()) {
        iMdns = new Zapp::MdnsProvider(""); // replace this to allow clients to set an alternative Bonjour implementation
    }
    Brn udn("");
    iOhNetDevice = new DvDevice(udn);
    iOhNetDevice->SetAttribute("Upnp.Domain", "openhome.org");
    iOhNetDevice->SetAttribute("Upnp.Type", "ohNet");
    iOhNetDevice->SetAttribute("Upnp.Version", "1");
    iOhNetDevice->SetAttribute("Upnp.FriendlyName", "ohNet device stack");
    iOhNetDevice->SetAttribute("Upnp.Manufacturer", "N/A");
    iOhNetDevice->SetAttribute("Upnp.ModelName", "ohNet device stack");
    iOhNetProvider = new DvProviderOhNet(*iOhNetDevice, Stack::InitParams().DvWebSocketPort());
    iOhNetDevice->SetEnabled();
}

DviStack::~DviStack()
{
    delete iOhNetDevice;
    delete iOhNetProvider;
    delete iMdns;
    delete iDviServerWebSocket;
    delete iDviServerUpnp;
    delete iDviDeviceMap;
    delete iSubscriptionManager;
}

TUint DviStack::BootId()
{
    Zapp::Mutex& lock = Stack::Mutex();
    lock.Wait();
    DviStack* self = DviStack::Self();
    TUint id = self->iBootId;
    lock.Signal();
    return id;
}

TUint DviStack::NextBootId()
{
    Zapp::Mutex& lock = Stack::Mutex();
    lock.Wait();
    DviStack* self = DviStack::Self();
    TUint id = self->iNextBootId;
    lock.Signal();
    return id;
}

void DviStack::UpdateBootId()
{
    Zapp::Mutex& lock = Stack::Mutex();
    lock.Wait();
    DviStack* self = DviStack::Self();
    self->iBootId = self->iNextBootId;
    self->iNextBootId++;
    lock.Signal();
}

DviServerUpnp& DviStack::ServerUpnp()
{
    DviStack* self = DviStack::Self();
    return *(self->iDviServerUpnp);
}

DviDeviceMap& DviStack::DeviceMap()
{
    DviStack* self = DviStack::Self();
    return *(self->iDviDeviceMap);
}

DviSubscriptionManager& DviStack::SubscriptionManager()
{
    DviStack* self = DviStack::Self();
    return *(self->iSubscriptionManager);
}

IMdnsProvider* DviStack::MdnsProvider()
{
    DviStack* self = DviStack::Self();
    return self->iMdns;
}

DviStack* DviStack::Self()
{
    return (DviStack*)Stack::DviStack();
}
