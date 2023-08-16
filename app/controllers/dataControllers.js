const dao = require("../services/dao");
const moment = require("moment");

const dataController= {};



            fetch("https://api.preciodelaluz.org/v1/prices/all?zone=PCB")
            .then(response => response.json())
            .then(response => {
                let matriz = Object.values(response);
                let result = 0;
                for(const data of matriz){
                    
                }
                

            })
            .catch(err => console.log(err));

            


dataController.allData = async(req, res) =>{
    const{} = req.params;

}



module.exports = dataController;