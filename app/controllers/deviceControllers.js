const deviceQuery = require("../services/queries/deviceQuery");
const httpContext = require("express-http-context");
const moment = require("moment");
const path = require("path");

const deviceController = {};

deviceController.add_device = async (req, res) =>{
    let user = httpContext.get("user");
    const {name, tag,idDevModel} = req.body;

    if(!name || !tag || !idDevModel) return res.sendStatus(409);
    try{
        const add = await deviceQuery.add_device(req.body, user);
        if(!add) return res.sendStatus(400);
        const device = await deviceQuery.getDevTag(tag);
        if(!device) res.sendStatus(404);
        const jsonDiv = await deviceQuery.findDivByIduser(user);
        return (jsonDiv) ? res.json(jsonDiv) : res.sendStatus(404);
    }catch(err){
        throw new Error(err);
    }
};

deviceController.addImage = async(req, res) =>{
    const {variable} = req.body;
    if(!variable) return res.sendStatus(409);
    try{
        if(!req.files || Object.keys(req.files).length === 0){
            return res.sendStatus(400);
        }
        const images = !req.files.imagen.length ? [req.files.imagen] : req.files.imagen;
        for(const item of images){
            let uploadPath= path.join(__dirname,"../resources/images/" + item.name);
            console.log(uploadPath);
            item.mv(uploadPath, (err) =>{
                if(err) return res.sendStatus(500);
            })
            await deviceQuery.add_image(variable, uploadPath);
        }
        return res.sendStatus(200);
    }catch(err){
        throw new Error(err);
    }
};

deviceController.totalmodels = async(req, res) =>{
    const {variable} = req.body;
    if(!variable) return res.sendStatus(409);
    try{
        const result = await deviceQuery.getModels(variable);
        return (!result) ? res.sendStatus(500) : res.json(result);
    }catch(err){
        throw new Error(err);
    }
};

deviceController.delete_divice = async (req, res) =>{
    const {id} = re.body;
    try{
        const consumDelete = await deviceQuery.consumptionDelete(id);
        if(consumDelete){
            const device = await deviceQuery.deleteFisico(id);
            if(device){
                return res.sendStatus(200);
            } else{
                return res.sendStatus(400);
            }
        } else{
            return res.sendStatus(400)
        }
    }catch(err){
        throw new Error(err);
    }
};

deviceController.findAllDevices = async(req, res) =>{
    let user = httpContext.get("user");
    try{
        const allDevices = await deviceQuery.findDivByIduser(user);
        return (allDevices) ? res.json(allDevices) : res.sendStatus(404);
    }catch(err){
        throw new Error(err);
    }
};

const deviceOn = async(idDevModel, idDevice) =>{
    try{
        const deviceState = await deviceQuery.getDevice(idDevice);
        if(deviceState.state === process.env.ON) return false;
            let lastOn = new Date();
            const addActivity = await deviceQuery.On(idDevice, lastOn, idDevModel);
            if(!addActivity) return false;
            await deviceQuery.changeActivity(idDevice, process.env.ON);
            const resultConsumptionOn = await deviceQuery.activityNow(idDevice);
            return resultConsumptionOn;
    }catch(err){
        throw new Error(err);
    }
};

            function diff_hour(dt2, dt1){
                let diff = (dt2.getTime() - dt1.getTime()) / 1000;
                diff /= (60 * 60);
                return diff;
            };

            function EachHour(hourOn,hourOff){
                let startHour= parseInt(hourOn);
                let endHour= parseInt(hourOff);
                let allHour= [];
                if(startHour <= endHour){
                    for(let i = startHour; i <= endHour; i++){
                    allHour.push(`${i}-${i+1}`)
                    }
                } else{
                    for(let i = startHour; i < 24; i++){
                        allHour.push(`${i}-${i+1}`);
                    }
                    for(let i= 0; i< endHour; i++){
                        allHour.push(`${i}-${i+1}`);
                    }
                }
                return allHour;
            };

            function handleDateChange(on,off){
                const onMoment = moment(on, 'DD-MM-YYYY HH:mm:ss');
                const offMoment = moment(off, 'DD-MM-YYYY HH:mm:ss');

                if(onMoment.isSame(offMoment,'day')){
                    return{
                        dateOn: onMoment.format('DD-MM-YYYY'),
                        dateOff:offMoment.format('DD-MM-YYYY'),
                    };
                } else{
                    let dateOn = onMoment.format('DD-MM-YYYY');
                    let dateOff = onMoment.format('DD-MM-YYYY');
                    return{
                        dateOn: dateOn,
                        dateOff: dateOff,
                    };
                }
            };

            function consumptionHours(on,off){
                const dateHourOn = on
                    const dateHour1 = moment(dateHourOn, 'DD-MM-YYYY HH:mm:ss');
                    const hourOn = dateHour1.format('HH');
                const dateHourOff = off;
                    const dateHour2 = moment(dateHourOff, 'DD-MM-YYYY HH:mm:ss');
                    const hourOff = dateHour2.format('HH'); 
                        return {hourOn,hourOff};
            };

const deviceOff = async(id, idDevModel, idDevice) =>{// funcnion que apaga los dispositivos
    try{
        const findDevice = await deviceQuery.activityNow(idDevice);//verifico la actima actividad del disp.
            if(findDevice.lastOff !== null) return false;// sale por el return si el capo lastOff de la ultima actividad tiene datos
                    let lastOff = new Date();// cojo la fecha y hora 
                    const activityOff = await deviceQuery.Off(id, lastOff);//  la inserto 
                if(!activityOff) return false;//aca capturo el error en caso de que no se inserte
            const changeDevActivity = await deviceQuery.changeActivity(idDevice, process.env.OFF);// actualizo en esta dos del dispoditivo en la tabla devices
                if(!changeDevActivity) return false;    // aca capturo en casa de que no se haga correctamente el insert            
            const consumption = await deviceQuery.getIdDeviceConsumption(id);// aca busco la actividad en ON y OFF del disp.
                if(!consumption.lastOn && !consumption.lastOff) return false;// aca capturo el error en caso de que ocurra
                    let dt2 = new Date(consumption.lastOn);// aca instancio en on
                    let dt1 = new Date(consumption.lastOff);// aca instancio en Off
                    let totalTime = diff_hour(dt1,dt2);// llamo a la funcion que calcula las horas de la actividad
            const hours = await deviceQuery.totalHours(id, totalTime); // inserto las horas de la actvidad.
                if(!hours) return false;// capturo el error en caso de que ocurra
            const findModel = await deviceQuery.KwhPerHour(idDevModel);// busco el consumo por horas en la tabla de modelos
                if(!findModel.consumo) return false;// capturo el error en caso de que ocurra
            const totalKwh = (findModel.consumo * totalTime);//el consumo lo multiplico por el tiempo de actividad
            const kwh = await deviceQuery.KwhTotal(id, totalKwh);//inserto el el consumo
                if(!kwh) return false;//capturo el error en caso de que ocurra
            const {dateOn, dateOff} = handleDateChange(consumption.lastOn,consumption.lastOff);// acá capturo formato que necesito en db
            const {hourOn,hourOff} = consumptionHours(consumption.lastOn,consumption.lastOff);// acá desestructuro las horas para hacer la busqueda en bd
            const totalConsumptionHours = EachHour(hourOn,hourOff);// acá 
            const moneyActivity= await deviceQuery.totalMoney(dateOn, dateOff, totalConsumptionHours);
            if(!moneyActivity) return false;
            const convert = (moneyActivity/1000);
            const result = convert * findModel.consumo;
            const moneyInserted = await deviceQuery.insertMoneyConsumption(id, result);
            return (!moneyInserted) ? false : true;
    }catch(err){
    
        throw new Error(err);
    }
};

deviceController.switchDevice = async(req, res) =>{
    const {id, idDevModel, idDevice} = req.body;
    let user = httpContext.get("user");
    try{
        const deviceState = await deviceQuery.getDevice(idDevice);
        if(deviceState.state === process.env.OFF){
            const activityOn = await deviceOn(idDevModel, idDevice);
            if(activityOn){
                    const jsonActivity = await deviceQuery.findDivByIduser(user);
                if(jsonActivity){
                    res.json(jsonActivity);
                } else{
                    res.sendStatus(404);
                }
            }else{
                res.sendstatus(400);
            }
        } else{
            const activityOff = await deviceOff(id, idDevModel, idDevice);
            if(activityOff){
                const jsonActivity = await deviceQuery.findDivByIduser(user);
                if(jsonActivity){
                    res.json(jsonActivity);
                } else{
                    res.sendStatus(404);
                }
            }else{
                res.sendStatus(400);
            }
        }
    }catch(err){
        throw new Error(err);
    };
};


module.exports = {deviceController, deviceOn, deviceOff};