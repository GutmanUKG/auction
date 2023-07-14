import HouseModel from '../models/houseItems.js';

export const addItem = async (req, res) => {
    try{
        const doc = new HouseModel({
            name: req.body.name,
            mainImage: req.body.mainImage,
            prevText: req.body.prevText,
            text: req.body.text,
            startPrice: req.body.startPrice,
            images: req.body.images,
            country: req.body.country,
            city: req.body.city,
            area: req.body.area,
            countRoom: req.body.countRoom,
            user: req.userId//приходит из utils/Auth.js
        })
        const item = await doc.save()
        res.json(item)
    }catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать елемент',
        });
    }

}

export const getAllItems = async (req, res) => {
    try{
        const items = await HouseModel.find().populate('user').exec();
        res.json(items)
    }catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить елементы',
        });
    }
}

