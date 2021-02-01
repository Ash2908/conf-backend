const fetch = require('node-fetch');

fetch('https://o136z8hk40.execute-api.us-east-1.amazonaws.com/dev/get-list-of-conferences')
.then(res=>res.json())
.then(data=>{
    const details=[...data.free,...data.paid];

    //Print the contents in a human readable format

    details.forEach(detail=>
        {
            const {confName,confStartDate,city,state,country,entryType,confRegUrl }=detail;
            console.log(`${confName}, ${confStartDate},${city},${state},${country},${entryType},${confRegUrl}
            `);
        });

    //Identify duplicates
    const lookup = details.reduce((acc, detail) => {
    acc[detail.confStartDate] = ++acc[detail.confStartDate] || 0;
    return acc;
  }, {});
  const com=details.filter(detail => lookup[detail.confStartDate]);

  let dupl=[], semanticDupl=[];

  for(let i=0;i<com.length;i++){
      for(let j=i+1;j<com.length;j++){
       
        //Exact Duplicates
        if (com[i].length === com[j].length) { 
            if(Object.keys(com[i]).every( 
              key => com[j].hasOwnProperty(key) 
                  && com[j][key] === com[i][key])){
                      dupl.push(com[j]);
                  }
        //Name can be different      
           else if(com[i].venue.toLowerCase()===com[j].venue.toLowerCase() 
            && com[i].confEndDate===com[j].confEndDate 
            && com[i].confUrl===com[j].confUrl) {
                semanticDupl.push(com[j]);
            }
            
          } 
      }
    }
      console.log(dupl);
      console.log(semanticDupl);
      //With loadash
    //   var result = _.isEqual(
    //     _.omit(com[i], ['confName']),
    //     _.omit(com[j], ['confName'])
    //   );

})
.catch(error=>console.log(error));


