export function calcualteNextPeriod(startDate,cycleLength){
  const start=new Date(startDate);
  const nextStart= new Date(start);
  nextStart.setDate(start.getDate()+cycleLength);
  return nextStart;
}

export function  getCyclePhases(startDate,endDate,cycleLength){
  const start=new Date(startDate);
  const end=new Date(endDate);
  //ovulation
  const ovulationDay=new Date(start);
  ovulationDay.setDate(start.getDate()+Math.floor(cycleLength/2));
  const ovulationStart= new Date(ovulationDay);
  ovulationStart.setDate(ovulationDay.getDate()-1);

  
  const ovulationEnd= new Date(ovulationDay);
  ovulationEnd.setDate(ovulationDay.getDate()-1);

  // Fertile Window: 5 days before ovulation to ovulation day
  const fertileStart = new Date(ovulationDay);
  fertileStart.setDate(ovulationDay.getDate() - 5);

  const fertileEnd = new Date(ovulationDay);

  //follicular
  const follicularStart=new Date(end.getDate()+1);
  const follicularEnd=new Date(ovulationDay);
  // Luteal Phase: From end of ovulation to end of cycle
  const lutealStart = new Date(ovulationEnd);
  const lutealEnd = new Date(start);
  lutealEnd.setDate(start.getDate() + cycleLength - 1);
  return {
    menstruation: { start, end },
    ovulation: { start: ovulationStart, end: ovulationEnd },
    fertileWindow: { start: fertileStart, end: fertileEnd },
    follicular: { start: follicularStart, end: follicularEnd },
    luteal: { start: lutealStart, end: lutealEnd }
  };

}