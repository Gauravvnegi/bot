import { ReservationStatusType, ReservationTableValue } from "../constants/reservation-table";

export class APIManipulator{
    /* Manipulation of the API DATA #For Testing */
    manipulateAPI(res:any,resType?:string){
      res.reservations=res.services;
      delete res.services; 

      let reservationTypes = ["OTA",'AGENT','WALK_IN','OFFLINE_SALES','BOOKING_ENGINE'];
      let roomType = ["Luxury",'Single','Double','Queen'];
      if(resType!==undefined){
        for(let ind=0;ind<reservationTypes.length;ind++)
          reservationTypes[ind]=resType;
      }
      let customers = [
        {name:'Saourav Kapoor',company:'BigOh'},
        {name:'Shivendra Porwal',company:'BigOh'},
        {name:'Satya Mishra',company:'BigOh'}, 
      ];
      let paymentMode = ['Cash','Google Pay','PhonePay'];
      let status = [ReservationStatusType.DRAFT,ReservationStatusType.CONFIRMED,ReservationStatusType.CANCELLED];
      for(let index=0; index<res.reservations.length;index++){ 
          res.reservations[index]={
            id:res.reservations[index].id,
            hotelId:"#"+this.randomNumber(200)+"5634",
            rooms:124+this.randomNumber(10),
            roomType:roomType[this.randomNumber(roomType.length)],
            confirmationNo:'12'+this.randomNumber(20)+'534',
            name:customers[this.randomNumber(customers.length)].name,
            company:customers[this.randomNumber(customers.length)].company,
            date:'0'+this.randomNumber(9)+'-0'+this.randomNumber(9)+'-20'+this.randomNumber(9)+'3',
            amount:this.randomNumber(50000),
            source:1,
            payment:paymentMode[this.randomNumber(paymentMode.length)],
            status:status[this.randomNumber(status.length)],
            reservationTypes: reservationTypes[this.randomNumber(reservationTypes.length)]
          };
      }   


      let totalDraft=0,totalCancel=0,totalConfirm=0;
      res.reservations.forEach(element => {
        if(element.status===ReservationStatusType.DRAFT) totalDraft++;
        else if(element.status===ReservationStatusType.CANCELLED) totalCancel++;
        else if(element.status===ReservationStatusType.CONFIRMED) totalConfirm++; 
      });

      res.entityStateCounts = {
        All:res.reservations.length,
        draft:totalDraft,
        confirmed:totalConfirm,
        cancelled:totalCancel
      };
 
    }
    
  /* Random Number Generator */
    randomNumber(value:number=10){
      return Math.floor(Math.floor(Math.random()*value));
    }
  
    /* Choose Filter data */
    filterReservation(response:any,responseType:string){
      if(responseType===ReservationTableValue.ALL) 
        this.manipulateAPI(response);
      else
        this.manipulateAPI(response,responseType);
    }
  }