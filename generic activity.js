 /*Form addition query and and it's parameters to invoke IR CRUD services*/

 //Invoke IR COde
 
if(tw.local.order && tw.local.order.header){
    //PLogDebug("'"+tw.local.logProcessName+","+ tw.local.logActivityName+","+ tw.local.logInstanceId+","+ tw.local.order.header.orderId+", NA, NA, Execution started', 'INFO'");
    tw.local.additionalQuery = new tw.object.SQLStatement();
    tw.local.additionalQuery.sql = "";
    tw.local.additionalQuery.parameters = new tw.object.listOf.SQLParameter();
	if(tw.local.processName || tw.local.logProcessName){
		tw.local.additionalQuery.sql += ' and PROCESS_NAME = ? '; 
		if(tw.local.processName)
			tw.local.additionalQuery.parameters.insertIntoList(tw.local.additionalQuery.parameters.listLength, params(tw.local.processName,"varchar","IN"));
		else
			tw.local.additionalQuery.parameters.insertIntoList(tw.local.additionalQuery.parameters.listLength, params(tw.local.logProcessName,"varchar","IN"));
    
	}
	if(tw.local.stepName || tw.local.logActivityName){
	tw.local.additionalQuery.sql += ' and STEP_NAME = ? '; 
		if(tw.local.stepName)
			tw.local.additionalQuery.parameters.insertIntoList(tw.local.additionalQuery.parameters.listLength, params(tw.local.stepName,"varchar","IN"));
		else
			tw.local.additionalQuery.parameters.insertIntoList(tw.local.additionalQuery.parameters.listLength, params(tw.local.logActivityName,"varchar","IN"));	
		
	}
	
	
    if(tw.local.productCategory || tw.local.order.header.productCategory){
		tw.local.additionalQuery.sql += ' and UPPER(PRODUCT_CATEGORY) = ? ';
	if(tw.local.productCategory)
		tw.local.additionalQuery.parameters.insertIntoList(tw.local.additionalQuery.parameters.listLength, params(tw.local.productCategory,"varchar","IN"));
    else
		tw.local.additionalQuery.parameters.insertIntoList(tw.local.additionalQuery.parameters.listLength, params(tw.local.order.header.productCategory,"varchar","IN"));
    
    }
	
	if(tw.local.market || tw.local.order.header.market){
		tw.local.additionalQuery.sql += ' and UPPER(MARKET)=? ';
		if(tw.local.market)
			tw.local.additionalQuery.parameters.insertIntoList(tw.local.additionalQuery.parameters.listLength, params(tw.local.market,"varchar","IN"));
		else
			tw.local.additionalQuery.parameters.insertIntoList(tw.local.additionalQuery.parameters.listLength, params(tw.local.order.header.market,"varchar","IN"));
	}
	
	if(tw.local.brand || tw.local.order.header.brand ){
		tw.local.additionalQuery.sql +=' and UPPER(BRAND)=? ';
		if(tw.local.brand)
			tw.local.additionalQuery.parameters.insertIntoList(tw.local.additionalQuery.parameters.listLength, params(tw.local.brand,"varchar","IN"));      
		else    
			tw.local.additionalQuery.parameters.insertIntoList(tw.local.additionalQuery.parameters.listLength, params(tw.local.order.header.brand,"varchar","IN"));    
	}	    
	
	
	if(tw.local.eventType){
		tw.local.additionalQuery.sql +=' and EVENT_TYPE = ? ' ;
		tw.local.additionalQuery.parameters.insertIntoList(tw.local.additionalQuery.parameters.listLength, params(tw.local.eventType,"varchar","IN"));   
	
	}
	if(tw.local.actionType){
		tw.local.additionalQuery.sql +=' and  ACTION_TYPE=? '; 
			tw.local.additionalQuery.parameters.insertIntoList(tw.local.additionalQuery.parameters.listLength, params(tw.local.actionType,"varchar","IN"));    
	}else{
		tw.local.additionalQuery.sql +=' and  ACTION_TYPE IS NULL '; 		
	}
	
	tw.local.additionalQuery.sql +=' and UPPER(SALES_MODEL)=? ';
		var salesModelData="NA";
		if(tw.local.order.header.salesModel){     
			if(tw.local.order.header.salesModel.toUpperCase()==String(tw.epv.PoleStarConfiguration.preOrderSalesModel)){
				salesModelData=tw.local.order.header.salesModel;
			}
		}
		tw.local.additionalQuery.parameters.insertIntoList(tw.local.additionalQuery.parameters.listLength, params(salesModelData,"varchar","IN"));
	
}else
    throw "Order is null . Can not get intelligent routing details"
    
    
PLogInfo("IR Data Service  Form Query-Additional Query"+tw.local.additionalQuery)
    
	//FORM SQL Query
	
	
tw.local.sqlStatements = new tw.object.SQLStatement();
tw.local.sqlStatements.parameters = new tw.object.listOf.SQLParameter();  

tw.local.sqlStatements.sql = "SELECT "+
                              " [RULE_ID] as ruleId"+
                              ",[PROCESS_NAME] as processName"+
                              ",[STEP_NAME] as stepName"+
                              ",[RULE] as ruleDescription"+
                              ",[PRODUCT_CATEGORY] as productCategory"+
                              ",[PRODUCT_SUB_CATEGORY] as productSubCategory"+
                              ",[MARKET] as market"+
                              ",[EVENT_TYPE] as eventType"+
                              ",[DELIVERY_MODE] as deliveryMode"+
                              ",[STATUS] as status"+
                              ",[RULE_INPUT] as ruleInput"+
                              ",[NOTE] as note"+
                              ",[RESULT1] as result1"+
                              ",[RESULT2] as result2"+
                              ",[RESULT3] as result3"+
                              ",[RESULT4] as result4"+
                              ",[RESULT5] as result5"+
                              ",[RESULT6] as result6"+
                              ",[RESULT7] as result7"+
                              ",[RESULT8] as result8"+
                              ",[RESULT9] as result9"+
                              ",[RESULT10] as result10"+
                              ",[REMARKS] as remarks"+
                              ",[COMMENTS] as comments"+
                              ",[BRAND] as brand"+
                              ",[COMPONENT_ID] as componentId"+
                              ",[ACTION_ID] as actionId"+
                              ",[GROUP_ID] as groupId"+
                              ",[CUSTOMER_EMAIL_EVENT_TYPE] as customerEmailEventType"+
                              ",[NOTIFY_CUSTOMER] as notifyCustomer"+
                              ",[TASK_ID] as taskId"+
                              ",[SALES_MODEL] as salesModel"+
                              ",[ACTION_TYPE] as actionType"+
                              " FROM "+ String(tw.env.schema_name)+ "ORDER_FULFILMENT_CONFIG WHERE RULE_ID IS NOT NULL and STATUS='ACTIVE' ";


if(tw.local.additionalQuery != null){
    tw.local.sqlStatements.sql += tw.local.additionalQuery.sql;
    tw.local.sqlStatements.parameters = tw.local.additionalQuery.parameters;  
}


//POST Script


tw.local.additionalQuery = null;
tw.local.sqlStatements = null;
tw.local.errorStackTrace = null;


//INSERT SLA INTO SCHEDULER:

if(tw.local.order != null && tw.local.order.header != null && tw.local.routingResult!= null && tw.local.routingResult[0].result8 != null && tw.local.routingResult[0].result8 !=""){
    //PLog("'"+tw.local.logProcessName+","+ tw.local.logActivityName+","+ tw.local.logInstanceId+","+ tw.local.order.header.orderId+", NA, NA, Execution started', 'INFO'");
    
    /*Form input BO to invoke Insert Scheduler Service*/
  tw.local.schedulerList = new tw.object.listOf.SchedulerData();
    
    /*This function will add input hours to current time*/
    function getDate(hour){
       var date = new tw.object.Date();
       var slaHours = date.getHours()+hour;
       date.setHours(slaHours);
        return date;
    }
    
    /*This function will populate scheduler BO*/
    function addScheduler(bpmOrderId,orderId,schedulerTime,schedulerStatus,typeOfEvent,retryCount,repeat,updatedDate){
    
        tw.local.schedulerList[tw.local.schedulerList.listLength] = new tw.object.SchedulerData();
        tw.local.schedulerList[tw.local.schedulerList.listLength-1].bpmOrderId = bpmOrderId;
        tw.local.schedulerList[tw.local.schedulerList.listLength-1].orderId = orderId;
        tw.local.schedulerList[tw.local.schedulerList.listLength-1].schedulerTime = schedulerTime;
        tw.local.schedulerList[tw.local.schedulerList.listLength-1].schedulerStatus = schedulerStatus;
        tw.local.schedulerList[tw.local.schedulerList.listLength-1].typeOfEvent = typeOfEvent;
        tw.local.schedulerList[tw.local.schedulerList.listLength-1].retryCount = retryCount;
        tw.local.schedulerList[tw.local.schedulerList.listLength-1].repeat = repeat;
        tw.local.schedulerList[tw.local.schedulerList.listLength-1].updatedDate = new TWDate();
        
    }
    
    function addQueryParam(keyVal){     
        addScheduler(tw.local.order.header.bpmOrderId,tw.local.order.header.orderId,getDate(Number(keyVal[0])),String(tw.epv.schedulerStatuses.pending), keyVal[1], "0",keyVal[2]);
    }
    
        if(tw.local.routingResult[0].result8.indexOf(",") !=1){
           var sla = tw.local.routingResult[0].result8.split(",");
           for(var i=0;i<sla.length;i++){
               addQueryParam(sla[i].split(":"));
           }
        }else
            addQueryParam(tw.local.routingResult[0].result8.split(":"));
}else
    throw 'can not insert SLA since order or routing result is null'

//Exceptional Handling 

tw.local.dPAError = new tw.object.DPAError();
if(tw.local.order != null && tw.local.order.header != null){
    //PLog("'"+tw.local.logProcessName+","+ tw.local.logActivityName+","+ tw.local.logInstanceId+","+ tw.local.order.header.orderId+", DBE_11001, DataBaseException, "+tw.system.error.toString(true)+"', 'ERROR'");
    tw.local.dPAError.orderId =  tw.local.order.header.orderId;
}
/*Nullify the variables*/
tw.local.sqlStatements = null;
tw.local.schedulerList = null;
tw.local.order = null;
tw.local.routingResult = null;

/*Exception handling needs to be done*/

tw.local.dPAError.errorCode = "DBE_11001";
tw.local.dPAError.errorType = "System";
tw.local.dPAError.errorMessage = "DataBaseException";
tw.local.dPAError.errorStackTrace = tw.system.error.xpath("/error/localizedMessage").item(0).getText();


//tw.local.dPAError.skipActivity = true;
tw.local.dPAError.skipBtnVisibility = true;


tw.local.dPAError.processName = tw.local.logProcessName;
tw.local.dPAError.stepName = tw.local.logActivityName+" - Insert SLA and Send Notification - Insert SLA into Scheduler";
tw.local.dPAError.instanceId = tw.local.logInstanceId;

//form sql query 

if(tw.local.schedulerList != null && tw.local.schedulerList.listLength > 0){
  tw.local.sqlStatements = new tw.object.listOf.SQLStatement();

    for(var i=0;i<tw.local.schedulerList.listLength;i++){
        
        tw.local.sqlStatements[i] = new tw.object.SQLStatement();
        tw.local.sqlStatements[i].sql = "INSERT INTO "+ String(tw.env.schema_name)+ "SCHEDULER"+
                  "([BPM_ORDER_ID] "+
                  " ,[ORDERID] "+
                  " ,[SCHEDULER_TIME] "+
                  " ,[SCHEDULER_STATUS] "+
                  ",[TYPE_OF_EVENT] "+
                  ",[RETRY_COUNT] "+
                  ",[REPEAT]"+
                  ",[UPDATED_DATE])"+
                  " VALUES "+
                  " (?,?,?,?,?,?,?,?)";
                  if(tw.local.schedulerList[i].schedulerTime){
                  if(tw.local.isRepeat==true){
                   tw.local.dateString=tw.local.schedulerList[i].schedulerTime.format('yyyy-MM-dd HH:mm:ss.SSS');
                  tw.local.schedulerList[i].schedulerTime.parse(tw.local.dateString, 'yyyy-MM-dd HH:mm:ss.SSS');
                              
                     }else{
                       tw.local.dateString=tw.local.schedulerList[i].schedulerTime.format('yyyy-MM-dd HH:mm:ss.SSS','GMT');
                  tw.local.schedulerList[i].schedulerTime.parse(tw.local.dateString, 'yyyy-MM-dd HH:mm:ss.SSS');
                 
                     }         
                              
                              }
          if(tw.local.schedulerList[i].updatedDate){
          tw.local.dateString=tw.local.schedulerList[i].updatedDate.format('yyyy-MM-dd HH:mm:ss.SSS', 'GMT');
          tw.local.schedulerList[i].updatedDate.parse(tw.local.dateString, 'yyyy-MM-dd HH:mm:ss.SSS');
        }             
        
         tw.local.sqlStatements[i].parameters = new tw.object.listOf.SQLParameter();
         tw.local.sqlStatements[i].parameters.insertIntoList(tw.local.sqlStatements[i].parameters.listLength, params(tw.local.schedulerList[i].bpmOrderId,"varchar","IN"));
         tw.local.sqlStatements[i].parameters.insertIntoList(tw.local.sqlStatements[i].parameters.listLength, params(tw.local.schedulerList[i].orderId,"varchar","IN"));
         tw.local.sqlStatements[i].parameters.insertIntoList(tw.local.sqlStatements[i].parameters.listLength, params(tw.local.schedulerList[i].schedulerTime,"timestamp","IN"));
         tw.local.sqlStatements[i].parameters.insertIntoList(tw.local.sqlStatements[i].parameters.listLength, params(tw.local.schedulerList[i].schedulerStatus,"varchar","IN"));
         tw.local.sqlStatements[i].parameters.insertIntoList(tw.local.sqlStatements[i].parameters.listLength, params(tw.local.schedulerList[i].typeOfEvent,"varchar","IN"));
         tw.local.sqlStatements[i].parameters.insertIntoList(tw.local.sqlStatements[i].parameters.listLength, params(tw.local.schedulerList[i].retryCount,"integer","IN"));
         tw.local.sqlStatements[i].parameters.insertIntoList(tw.local.sqlStatements[i].parameters.listLength, params(tw.local.schedulerList[i].repeat,"varchar","IN"));
        tw.local.sqlStatements[i].parameters.insertIntoList(tw.local.sqlStatements[i].parameters.listLength, params(tw.local.schedulerList[i].updatedDate,"timestamp","IN"));
        

     //  tw.local.datestring=tw.local.date.format('yyyy-MM-dd HH:mm:ss.SSS', 'GMT');

//tw.local.date.parse(tw.local.datestring, 'yyyy-MM-dd hh:mm:ss.SSS');

    }
    
    
}


//nullify data
tw.local.results = null;
tw.local.schedulerList = null;
tw.local.isQueryOnly = null;
tw.local.dateString=null;
//generate EVENT

PLogInfo("Generate Event --Init--");
if(tw.local.order && tw.local.order.header){
    PLogInfo(tw.local.order.header.orderId);
}


//Note:Bulk [data] creation for oderLine not handled as of now.
var isPostNotification=null;

/**
    Below are the list of methods to build events based on IR and Type of event
**/

function getGroupId(index){

    var groupId="";
     if(tw.local.routingResult.groupId && tw.local.routingResult.groupId.indexOf(":") != -1){
                 if(tw.local.routingResult.groupId.split(":")[isPostNotification] != "NA"){     
                      
                      groupId=tw.local.routingResult.groupId.split(":")[isPostNotification];
                  }             
    }
    return groupId;
}

/**
    Extract CustomerEmailEventType
**/
function getCustomerEmailEventType(){
    var customerEmailEventType;
    if(tw.local.routingResult.customerEmailEventType        && 
       tw.local.routingResult.customerEmailEventType.indexOf(":") != -1){
       
         if(tw.local.routingResult.customerEmailEventType.split(":")[isPostNotification] != "NA"){
             customerEmailEventType=tw.local.routingResult.customerEmailEventType.split(":")[isPostNotification];
         }else{
             customerEmailEventType="";
         }       
    }
    return customerEmailEventType;
}


/**
    Construct Tasks Object
**/
function constructTasks(index){
    tw.local.events.data[index].taskList.tasks = new tw.object.listOf.Tasks();
    
    var componentSplit=tw.local.routingResult.componentId.split(",");
    var actionSplit=tw.local.routingResult.actionId.split(",");
    var notifyCustomerSplit=tw.local.routingResult.notifyCustomer.split(",");
    var taskIdSplit=tw.local.routingResult.taskId.split(",");      
    var k=0;
    
    for(var i=0;i<componentSplit.length;i++){
        var taskData=componentSplit[i].split(":");
        var actiondata=actionSplit[i].split(":");
        
        if(taskData[0].indexOf(tw.local.notificationType) != -1){
            tw.local.events.data[index].taskList.tasks[k]=new tw.object.Tasks();
            
            tw.local.events.data[index].taskList.tasks[k].id=taskIdSplit[i];
            tw.local.events.data[index].taskList.tasks[k].componentId=taskData[1];
            tw.local.events.data[index].taskList.tasks[k].priority=taskData[2];
            tw.local.events.data[index].taskList.tasks[k].notifyCustomer= notifyCustomerSplit[i];
            tw.local.events.data[index].taskList.tasks[k].actions=new tw.object.listOf.Actions();
            
            for(var j=0;j<actiondata.length;j++){
                tw.local.events.data[index].taskList.tasks[k].actions[j]=new tw.object.Actions();
                if(actiondata[j]!="NA"){
                    tw.local.events.data[index].taskList.tasks[k].actions[j].id=actiondata[j];
                }
            }
            k++;
        }
    }
    
}

/**
    Construct Components/Task object 
**/
function constructComponents(index){
    tw.local.events.data[index].taskList = new tw.object.TaskList();
    tw.local.events.data[index].taskList.groupId=getGroupId(index);
    constructTasks(index);
}

/**
    Construct TaskList Object
**/
function constructTaskList(size){
    if(tw.local.routingResult.componentId &&        
       tw.local.routingResult.taskId &&  
       tw.local.routingResult.notifyCustomer){
       
       
       var length=tw.local.events.data.listLength;
       tw.local.events.data[length] = new tw.object.Data();
      if(size==1){  
      	tw.local.events.data[length].customerEmailEventType=getCustomerEmailEventType();
       }
       tw.local.events.data[length].eventType="TASKLIST";
        
       tw.local.events.data[length].orderId=tw.local.order.header.orderId;
        
       if(tw.local.lineItemRequired){
            tw.local.events.data[length].orderLineId=(tw.local.order.lineItems && tw.local.order.lineItems.listLength>0)?tw.local.order.lineItems[0].lineItemId:null;
       }
        
       constructComponents(length);
    }
}

/**
 Construct Event/Email Type event Object
**/    
function constructEvent(type){
    var length=tw.local.events.data.listLength;
    tw.local.events.data[length] = new tw.object.Data();
    
    tw.local.events.data[length].customerEmailEventType=getCustomerEmailEventType();
      
    if(type && type.search('(CUSEML)$')!=-1){
      //Place customerEmailEventType if its ends with EML
    	 tw.local.events.data[length].customerEmailEventType = type;
    }else if(type && type.search('(EML)$') != -1 ){
      //Place partnerEmailEventType if its ends with EML
        tw.local.events.data[length].partnerEmailEventType=type;
    }else{
        tw.local.events.data[length].eventType=type;        
    }
        
    tw.local.events.data[length].orderId=tw.local.order.header.orderId;
    
    if(tw.local.lineItemRequired)
        tw.local.events.data[length].orderLineId=tw.local.order.header.lineItemId;   
    PLogInfo("constructEvent()-post"+tw.local.events);    
}

//-------------------End of method definition- Actual implementation begins-------------------------------------------
tw.local.events = new tw.object.Events();
tw.local.events.data = new tw.object.listOf.Data();
    
tw.local.events.subject=String(tw.epv.NotifyDetails.subject);
tw.local.events.eventType=String(tw.epv.NotifyDetails.eventType);
tw.local.events.metadataVersion=String(tw.epv.NotifyDetails.metadataVersion);

if(tw.local.routingResult){
    if(tw.local.notificationType.toUpperCase()=="PRE"){
        isPostNotification=0;
    }else if(tw.local.notificationType.toUpperCase()=="PST"){
        isPostNotification=1;
    }
    
    if(tw.local.routingResult.result9 && tw.local.routingResult.result9.indexOf(":") != -1){

        var split = tw.local.routingResult.result9.split(":");
            
        var data = split[isPostNotification].split(",");
        
        
        for(var i=0;i<data.length;i++){
            if(data[i].toUpperCase()=="TASKLIST"){
                //Construct TaskList
                constructTaskList(data.length);
            }else{
                //Construct Email/Event
                constructEvent(data[i]);
            }
        }
    }
}
PLogInfo(tw.local.notificationType+" TaskList done.");
//PLogInfo("'"+tw.local.logProcessName+","+ tw.local.logActivityName+","+ tw.local.logInstanceId+","+ tw.local.orderHeader.orderId+", NA, NA, Post TaskList done', 'INFO'");
//post
tw.local.dPAError = null;
tw.local.operationName= null;
tw.local.aisRequest=null;
tw.local.eventType=null;
tw.local.partnerEmailEventType=null;
tw.local.customerEmailEventType=null;
tw.local.aisResponse=null;
tw.local.orderLineDetails=null;

//Exception

PLogError("Generate Event- Failure: "+tw.system.error.toString(true));
    tw.local.dPAError = new tw.object.DPAError();
    if(tw.local.order && tw.local.order.header)
        tw.local.dPAError.orderId = tw.local.order.header.orderId;
        
    tw.local.dPAError.errorType= String(tw.epv.exceptionDetails.systemType);
    tw.local.dPAError.skipActivity = false;
    tw.local.dPAError.skipBtnVisibility = true;
    tw.local.dPAError.errorMessage=tw.system.error.toString(true);

PLogError("Generate Event- Failure after"+tw.local.dPAError.errorMessage);

//Send Notification

PLogInfo("Send Notification"+tw.local.order+tw.local.events);
if(tw.local.order  &&  tw.local.order.header)
{
tw.local.orderId=tw.local.order.header.orderId;
}
//AIS REQUEST INITIALIZATION 
tw.local.aisRequest = new tw.object.AISRequest();
tw.local.aisRequest.aisRuleData = new tw.object.AISRulesData();

tw.local.aisRequest.aisRuleData.targetSAM=String(tw.epv.OMSSAMDetails.samName);
tw.local.aisRequest.aisRuleData.operationName=String(tw.epv.OMSSAMDetails.notifyOMS);

tw.local.aisRequest.events = new tw.object.listOf.Events();

tw.local.aisRequest.events.insertIntoList(tw.local.aisRequest.events.listLength,tw.local.events);


try{
PLogDebug(tw.local.aisRequest.toXMLString());
}catch(ex){

}


//exception 

if(!tw.local.dPAError){

    tw.local.dPAError = new tw.object.DPAError();
    tw.local.dPAError.errorMessage=tw.system.error.toString(true);
      tw.local.dPAError.orderId = tw.local.order.header.orderId;
    
}
  
   tw.local.dPAError.orderId=tw.local.orderId;
   
    tw.local.dPAError.instanceId = tw.local.logInstanceId;
    tw.local.dPAError.processName = tw.local.logProcessName;
    tw.local.dPAError.stepName = tw.local.logActivityName;
    tw.local.dPAError.errorType= String(tw.epv.exceptionDetails.systemType);
    tw.local.dPAError.skipActivity = false;
    tw.local.dPAError.skipBtnVisibility = true;
    if(tw.local.dPAOperationName){
        tw.local.dPAOperationName+=",NTYOMSFLD";
    }else{
        tw.local.dPAOperationName="NTYOMSFLD";
    }
    tw.local.dPAError.operationName=tw.local.dPAOperationName;
        
PLogInfo("Send Notification and Order Satatus to OMS  Notify OMS- Failure after"+tw.local.dPAError+""+tw.local.dPAError.operationName);tw.local.PostNotificationStatus = "Success";

//AIS REQUEST

/*Form the input AIS BO to invoke it*/
if(tw.local.order!= null && tw.local.routingResult!=null && tw.local.routingResult.listLength > 0){
    //PLog("'"+tw.local.logProcessName+","+ tw.local.logActivityName+","+ tw.local.logInstanceId+","+ tw.local.order.header.orderId+", NA, NA, Execution started', 'INFO'");
    tw.local.aisRequest = new tw.object.AISRequest();
    tw.local.aisRequest.orderDetails = new tw.object.Order();
    tw.local.aisRequest.orderDetails.header = new tw.object.OrderData(); 
    tw.local.aisRequest.orderDetails.header.orderId = tw.local.order.header.orderId;
    tw.local.aisRequest.orderDetails.header.lineItemId = tw.local.order.header.lineItemId
    tw.local.aisRequest.orderDetails.header.productCategory = tw.local.order.header.productCategory;
    tw.local.aisRequest.orderDetails.header.brand = tw.local.order.header.brand;
    tw.local.aisRequest.orderDetails.header.eventType = tw.local.eventType;
    tw.local.aisRequest.orderDetails.header.market = tw.local.order.header.market;
    tw.local.aisRequest.orderDetails.header.deliveryMode = tw.local.order.header.deliveryMode;
    tw.local.aisRequest.orderDetails.header.status = tw.local.order.header.status;
    tw.local.aisRequest.orderDetails.header.cdsId = tw.local.order.header.cdsId;
    tw.local.aisRequest.orderDetails.header.createDate = tw.local.order.header.createDate;
    tw.local.aisRequest.orderDetails.header.updateDate = tw.local.order.header.updateDate; 
    tw.local.aisRequest.orderDetails.header.handoverDate = tw.local.order.header.handoverDate;
    tw.local.aisRequest.orderDetails.header.completedDate = tw.local.order.header.completedDate;
    tw.local.aisRequest.orderDetails.header.bpmOrderId = tw.local.order.header.bpmOrderId
    tw.local.aisRequest.orderDetails.header.bpmOrderStatus = tw.local.order.header.bpmOrderStatus;
    tw.local.aisRequest.orderDetails.header.version = tw.local.order.header.version;
    tw.local.aisRequest.orderDetails.header.appVersion = tw.local.order.header.appVersion;
    tw.local.aisRequest.orderDetails.header.description = tw.local.order.header.description;
    tw.local.aisRequest.orderDetails.header.note = tw.local.order.header.note;
    tw.local.aisRequest.orderDetails.header.teamName = tw.local.order.header.teamName;
    tw.local.aisRequest.orderDetails.header.extData = tw.local.order.header.extData;
    if(tw.local.order.lineItems != null && tw.local.order.lineItems.listLength > 0){
      tw.local.aisRequest.orderDetails.lineItems = new tw.object.listOf.OrderData();
      for(var i=0;i<tw.local.order.lineItems.listLength;i++){
          tw.local.aisRequest.orderDetails.lineItems[i] = new tw.object.OrderData();
          tw.local.aisRequest.orderDetails.lineItems[i].orderId = tw.local.order.lineItems[i].orderId
          tw.local.aisRequest.orderDetails.lineItems[i].lineItemId = tw.local.order.lineItems[i].lineItemId
          
tw.local.aisRequest.orderDetails.lineItems[i].brand = tw.local.order.lineItems[i].brand;
          tw.local.aisRequest.orderDetails.lineItems[i].productCategory = tw.local.order.lineItems[i].productCategory;
          tw.local.aisRequest.orderDetails.lineItems[i].eventType = tw.local.eventType;
          tw.local.aisRequest.orderDetails.lineItems[i].market = tw.local.order.lineItems[i].market;
          tw.local.aisRequest.orderDetails.lineItems[i].deliveryMode = tw.local.order.lineItems[i].deliveryMode;
          tw.local.aisRequest.orderDetails.lineItems[i].status = tw.local.order.lineItems[i].status;
          tw.local.aisRequest.orderDetails.lineItems[i].cdsId = tw.local.order.lineItems[i].cdsId;
          tw.local.aisRequest.orderDetails.lineItems[i].createDate = tw.local.order.lineItems[i].createDate;
          tw.local.aisRequest.orderDetails.lineItems[i].updateDate = tw.local.order.lineItems[i].updateDate; 
          tw.local.aisRequest.orderDetails.lineItems[i].handoverDate = tw.local.order.lineItems[i].handoverDate;
          tw.local.aisRequest.orderDetails.lineItems[i].completedDate = tw.local.order.lineItems[i].completedDate;
          tw.local.aisRequest.orderDetails.lineItems[i].bpmOrderId = tw.local.order.lineItems[i].bpmOrderId
          tw.local.aisRequest.orderDetails.lineItems[i].bpmOrderStatus = tw.local.order.lineItems[i].bpmOrderStatus;
          tw.local.aisRequest.orderDetails.lineItems[i].version = tw.local.order.lineItems[i].version;
          tw.local.aisRequest.orderDetails.lineItems[i].appVersion = tw.local.order.lineItems[i].appVersion;
          tw.local.aisRequest.orderDetails.lineItems[i].description = tw.local.order.lineItems[i].description;
          tw.local.aisRequest.orderDetails.lineItems[i].note = tw.local.order.lineItems[i].note;
          tw.local.aisRequest.orderDetails.lineItems[i].teamName = tw.local.order.lineItems[i].teamName;
          tw.local.aisRequest.orderDetails.lineItems[i].extData = tw.local.order.lineItems[i].extData;
      }  
    }                              
   
   

   tw.local.aisRequest.orderDetails.dpaExceptionDetails=tw.local.order.dpaExceptionDetails;

   
    tw.local.aisRequest.aisRuleData = new tw.object.AISRulesData();
    tw.local.aisRequest.aisRuleData.operationName = tw.local.routingResult[0].result2;
    tw.local.aisRequest.aisRuleData.targetEndpointURL = tw.local.routingResult[0].result3;
    tw.local.aisRequest.aisRuleData.subscriptionKey = tw.local.routingResult[0].result4;
    tw.local.aisRequest.aisRuleData.subscriptionValue = tw.local.routingResult[0].result5;
    tw.local.aisRequest.aisRuleData.retry = tw.local.routingResult[0].result6;
    tw.local.aisRequest.aisRuleData.retryWait = tw.local.routingResult[0].result7;
    tw.local.aisRequest.aisRuleData.targetSAM="";

    
}else
    throw 'Order object or routing result is null .Can not invoke SYNC AIS'
//POST:

tw.local.syncResponse = tw.local.aisResponse;
//if(tw.local.order != null && tw.local.order.header != null)
   
/*Nullify the variables*/
//tw.local.order = null;
//tw.local.aisRequest = null;

if(tw.local.aisResponse){
	if(tw.local.aisResponse.orderDetails){
		if(tw.local.aisResponse.orderDetails.header){
			if(tw.local.aisResponse.orderDetails.header.orderId)
				tw.local.order.header.orderId = tw.local.aisResponse.orderDetails.header.orderId;
			if(tw.local.aisResponse.orderDetails.header.lineItemId)
				tw.local.order.header.lineItemId = tw.local.aisResponse.orderDetails.header.lineItemId;
			if(tw.local.aisResponse.orderDetails.header.bpmOrderId)
				tw.local.order.header.bpmOrderId = tw.local.aisResponse.orderDetails.header.bpmOrderId;
			if(tw.local.aisResponse.orderDetails.header.productCategory)
				tw.local.order.header.productCategory = tw.local.aisResponse.orderDetails.header.productCategory;
			if(tw.local.aisResponse.orderDetails.header.brand)
				tw.local.order.header.brand = tw.local.aisResponse.orderDetails.header.brand;
			if(tw.local.aisResponse.orderDetails.header.productSubCategory)
				tw.local.order.header.productSubCategory = tw.local.aisResponse.orderDetails.header.productSubCategory;
			if(tw.local.aisResponse.orderDetails.header.eventType)
				tw.local.order.header.eventType = tw.local.aisResponse.orderDetails.header.eventType;
			if(tw.local.aisResponse.orderDetails.header.market)
				tw.local.order.header.market = tw.local.aisResponse.orderDetails.header.market;
			if(tw.local.aisResponse.orderDetails.header.deliveryMode)
				tw.local.order.header.deliveryMode = tw.local.aisResponse.orderDetails.header.deliveryMode;             
			if(tw.local.aisResponse.orderDetails.header.status)
				tw.local.order.header.status = tw.local.aisResponse.orderDetails.header.status;
			if(tw.local.aisResponse.orderDetails.header.cdsId)
				tw.local.order.header.cdsId = tw.local.aisResponse.orderDetails.header.cdsId; 
			if(tw.local.aisResponse.orderDetails.header.version)
				tw.local.order.header.version = tw.local.aisResponse.orderDetails.header.version;  
			if(tw.local.aisResponse.orderDetails.header.createDate)
				tw.local.order.header.createDate = tw.local.aisResponse.orderDetails.header.createDate;  
			if(tw.local.aisResponse.orderDetails.header.updateDate)
				tw.local.order.header.updateDate = tw.local.aisResponse.orderDetails.header.updateDate;  
			if(tw.local.aisResponse.orderDetails.header.handoverDate)
				tw.local.order.header.handoverDate = tw.local.aisResponse.orderDetails.header.handoverDate; 
			if(tw.local.aisResponse.orderDetails.header.completedDate)
				tw.local.order.header.completedDate = tw.local.aisResponse.orderDetails.header.completedDate;
			if(tw.local.aisResponse.orderDetails.header.description)
				tw.local.order.header.description = tw.local.aisResponse.orderDetails.header.description; 
			if(tw.local.aisResponse.orderDetails.header.note)
				tw.local.order.header.note = tw.local.aisResponse.orderDetails.header.note; 
			if(tw.local.aisResponse.orderDetails.header.appVersion)
				tw.local.order.header.appVersion = tw.local.aisResponse.orderDetails.header.appVersion;                                                                                                                 
			if(tw.local.aisResponse.orderDetails.header.teamName)
				tw.local.order.header.teamName = tw.local.aisResponse.orderDetails.header.teamName;   
			if(tw.local.aisResponse.orderDetails.header.bpmOrderStatus)
				tw.local.order.header.bpmOrderStatus = tw.local.aisResponse.orderDetails.header.bpmOrderStatus; 
			if(tw.local.aisResponse.orderDetails.header.bpmOrderId)
				tw.local.order.header.bpmOrderId = tw.local.aisResponse.orderDetails.header.bpmOrderId; 
			if(tw.local.aisResponse.orderDetails.header.extData)
				tw.local.order.header.extData = tw.local.aisResponse.orderDetails.header.extData;
		}
		if(tw.local.aisResponse.orderDetails.lineItems != null && tw.local.aisResponse.orderDetails.lineItems.listLength > 0){
			for(var i=0 ; i < tw.local.aisResponse.orderDetails.lineItems.listLength ; i++){
				if(tw.local.aisResponse.orderDetails.lineItems[i].orderId)
					tw.local.order.lineItems[i].orderId = tw.local.aisResponse.orderDetails.lineItems[i].orderId;
				if(tw.local.aisResponse.orderDetails.lineItems[i].lineItemId)
					tw.local.order.lineItems[i].lineItemId = tw.local.aisResponse.orderDetails.lineItems[i].lineItemId;
				if(tw.local.aisResponse.orderDetails.lineItems[i].productCategory)
					tw.local.order.lineItems[i].productCategory = tw.local.aisResponse.orderDetails.lineItems[i].productCategory;
					if(tw.local.aisResponse.orderDetails.lineItems[i].brand)
					tw.local.order.lineItems[i].brand = tw.local.aisResponse.orderDetails.lineItems[i].brand;
				if(tw.local.aisResponse.orderDetails.lineItems[i].productSubCategory)
					tw.local.order.lineItems[i].productSubCategory = tw.local.aisResponse.orderDetails.lineItems[i].productSubCategory;
				if(tw.local.aisResponse.orderDetails.lineItems[i].eventType)
					tw.local.order.lineItems[i].eventType = tw.local.aisResponse.orderDetails.lineItems[i].eventType;
				if(tw.local.aisResponse.orderDetails.lineItems[i].market)
					tw.local.order.lineItems[i].market = tw.local.aisResponse.orderDetails.lineItems[i].market;
				if(tw.local.aisResponse.orderDetails.lineItems[i].deliveryMode)
					tw.local.order.lineItems[i].deliveryMode = tw.local.aisResponse.orderDetails.lineItems[i].deliveryMode;
				if(tw.local.aisResponse.orderDetails.lineItems[i].status)
					tw.local.order.lineItems[i].status = tw.local.aisResponse.orderDetails.lineItems[i].status;
				if(tw.local.aisResponse.orderDetails.lineItems[i].cdsId)
					tw.local.order.lineItems[i].cdsId = tw.local.aisResponse.orderDetails.lineItems[i].cdsId;
				if(tw.local.aisResponse.orderDetails.lineItems[i].version)
					tw.local.order.lineItems[i].version = tw.local.aisResponse.orderDetails.lineItems[i].version;
				if(tw.local.aisResponse.orderDetails.lineItems[i].createDate)
					tw.local.order.lineItems[i].createDate = tw.local.aisResponse.orderDetails.lineItems[i].createDate;
				if(tw.local.aisResponse.orderDetails.lineItems[i].updateDate)
					tw.local.order.lineItems[i].updateDate = tw.local.aisResponse.orderDetails.lineItems[i].updateDate;
				if(tw.local.aisResponse.orderDetails.lineItems[i].handoverDate)
					tw.local.order.lineItems[i].handoverDate = tw.local.aisResponse.orderDetails.lineItems[i].handoverDate;
				if(tw.local.aisResponse.orderDetails.lineItems[i].completedDate)
					tw.local.order.lineItems[i].completedDate = tw.local.aisResponse.orderDetails.lineItems[i].completedDate;
				if(tw.local.aisResponse.orderDetails.lineItems[i].description)
					tw.local.order.lineItems[i].description = tw.local.aisResponse.orderDetails.lineItems[i].description;
				if(tw.local.aisResponse.orderDetails.lineItems[i].note)
					tw.local.order.lineItems[i].note = tw.local.aisResponse.orderDetails.lineItems[i].note; 
				if(tw.local.aisResponse.orderDetails.lineItems[i].appVersion)
					tw.local.order.lineItems[i].appVersion = tw.local.aisResponse.orderDetails.lineItems[i].appVersion;
				if(tw.local.aisResponse.orderDetails.lineItems[i].teamName)
					tw.local.order.lineItems[i].teamName = tw.local.aisResponse.orderDetails.lineItems[i].teamName; 
				if(tw.local.aisResponse.orderDetails.lineItems[i].bpmOrderStatus)
					tw.local.order.lineItems[i].bpmOrderStatus = tw.local.aisResponse.orderDetails.lineItems[i].bpmOrderStatus; 
				if(tw.local.aisResponse.orderDetails.lineItems[i].bpmOrderId)
					tw.local.order.lineItems[i].bpmOrderId = tw.local.aisResponse.orderDetails.lineItems[i].bpmOrderId;
				if(tw.local.aisResponse.orderDetails.lineItems[i].extData)
					tw.local.order.lineItems[i].extData = tw.local.aisResponse.orderDetails.lineItems[i].extData; 
		   }
		}
	}
}
EXCEPTION:

if(tw.local.dPAError != null){
PLogDebug("DPA Error obj in Invoke Sync AIS"+tw.local.dPAError);
    tw.local.dPAError.instanceId = tw.local.logInstanceId;
    tw.local.dPAError.processName = tw.local.logProcessName;
    tw.local.dPAError.stepName = tw.local.logActivityName;
    tw.local.dPAError.orderId = tw.local.order.header.orderId;
    
    if(tw.local.dPAError.skipActivity!=true)
        tw.local.dPAError.skipActivity = false;
    
    tw.local.dPAError.skipBtnVisibility=true;
    if(tw.local.dPAError.retryMode==null){
    tw.local.dPAError.retryMode="";
    }    
}

tw.local.order = null;
tw.local.aisRequest = null;
PLogInfo("Inside Invoke Sync- Failure"+tw.system.error.toString(true));




 
