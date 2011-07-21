package openhome.net.controlpoint;

import ohnet.IPropertyChangeListener;
import ohnet.Property;

/**
 * Base class for all proxies
 */
public class CpProxy implements ICpProxy
{	
	/**
	 * Class representing subscription status within a proxy.
	 */
	enum SubscriptionStatus
    {
        E_NOT_SUBSCRIBED,
        E_SUBSCRIBING,
        E_SUBSCRIBED
    }
	
	private native long CpProxyCreate(String aDomain, String aName, int aVersion, long aDevice);
	private native void CpProxyDestroy(long aProxy);
	private native long CpProxyService(long aProxy);
	private native void CpProxySubscribe(long aHandle);
	private native void CpProxyUnsubscribe(long aHandle);
	private native void CpProxySetPropertyChanged(long aHandle, IPropertyChangeListener aCallback);
	private native void CpProxySetPropertyInitialEvent(long aHandle, IPropertyChangeListener aCallback);
	private native void CpProxyPropertyReadLock(long aHandle);
	private native void CpProxyPropertyReadUnlock(long aHandle);
	private native void CpProxyAddProperty(long aHandle, long aProperty);
	
	static
    {
        System.loadLibrary("ohNet");
        System.loadLibrary("ohNetJni");
    }
	
	protected long iHandle = 0;
	protected CpService iService = null;
	private IPropertyChangeListener iCallbackPropertyChanged = null;
	private IPropertyChangeListener iCallbackInitialEvent = null;
	private SubscriptionStatus iSubscriptionStatus = SubscriptionStatus.E_NOT_SUBSCRIBED;
	private Object iSubscriptionStatusLock = null;
	
	/**
	 * Create a proxy that will be manually populated with actions/properties.
	 * In most cases, clients should create proxy instances for specific services instead.
	 * 
	 * @param aDomain	the domain (vendor) name.
	 * @param aName		the service name.
	 * @param aVersion	the version number.
	 * @param aDevice	a handle to the device the proxy will communicate with / operate on.
	 */
	protected CpProxy(String aDomain, String aName, int aVersion, CpDevice aDevice)
    {
        iHandle = CpProxyCreate(aDomain, aName, aVersion, aDevice.getHandle());
        long serviceHandle = CpProxyService(iHandle);
        iService = new CpService(serviceHandle);
        iSubscriptionStatusLock = new Object();
    }
	
	/**
	 * Destroy this proxy.
	 */
	protected void disposeProxy()
    {
        boolean unsubscribe;
        synchronized (iSubscriptionStatusLock)
        {
            unsubscribe = (iSubscriptionStatus != SubscriptionStatus.E_NOT_SUBSCRIBED);
        }
        if (unsubscribe)
            unsubscribe();
//        System.out.println("About to call CpProxyDestroy...");
        CpProxyDestroy(iHandle);
//        System.out.println("Returned from CpProxyDestroy function...");
    }
	
	public void subscribe()
    {
        synchronized (iSubscriptionStatusLock)
        {
            iSubscriptionStatus = SubscriptionStatus.E_SUBSCRIBING;
        }
        CpProxySubscribe(iHandle);
    }
	
	public void unsubscribe()
    {
        synchronized (iSubscriptionStatusLock)
        {
            iSubscriptionStatus = SubscriptionStatus.E_NOT_SUBSCRIBED;
        }
        CpProxyUnsubscribe(iHandle);
    }
	
	public void setPropertyChanged(IPropertyChangeListener aPropertyChanged)
    {
        iCallbackPropertyChanged = aPropertyChanged;
        CpProxySetPropertyChanged(iHandle, iCallbackPropertyChanged);
    }

    public void setPropertyInitialEvent(IPropertyChangeListener aInitialEvent)
    {
        iCallbackInitialEvent = aInitialEvent;
        CpProxySetPropertyInitialEvent(iHandle, iCallbackInitialEvent);
    }
	
    /**
     * Acquire a lock to read the value of a property.
     * Must be called before reading the value of a property.
     */
	protected void propertyReadLock()
    {
        CpProxyPropertyReadLock(iHandle);
    }

	/**
	 * Release the read lock after reading the value of a property.
	 * Must be called once for each call to {@link #propertyReadLock}.
	 */
    protected void propertyReadUnlock()
    {
        CpProxyPropertyReadUnlock(iHandle);
    }
    
    
    protected void reportEvent(IPropertyChangeListener aCallback)
    {
        synchronized (iSubscriptionStatusLock)
        {
            if (iSubscriptionStatus == SubscriptionStatus.E_SUBSCRIBING)
            {
                iSubscriptionStatus = SubscriptionStatus.E_SUBSCRIBED;
            }
            if (iSubscriptionStatus == SubscriptionStatus.E_SUBSCRIBED && aCallback != null)
            {
                aCallback.notifyChange();
            }
        }
    }
    
    /**
     * Add a property to a service.
     * Will normally only be called by auto-generated code.
     * 
     * @param aProperty the property to be added to the service.
     */
    protected void addProperty(Property aProperty)
    {
        CpProxyAddProperty(iHandle, aProperty.getHandle());
    }
	
}
