const database = require('./datbase.js');

module.exports = function printInventory(inputs) {
    const LEN = 10;
    let product_map = new Map();
    inputs.forEach(element => {
        if (!product_map.has(element)) {
            product_map.set(element, 1);
        } else {
            let old_count = product_map.get(element);
            product_map.set(element,++old_count);
        }
    });
    product_map.forEach((value, key, product_map) => {
        if(key.length != LEN){
            let temp = key.split('-');
            product_map.set(temp[0], parseInt(temp[1]));
            product_map.delete(key);
        }
    });

    let buy_product = [];
    database.loadAllItems().forEach(element => {
        let value = product_map.get(element.barcode);
        if(value != undefined){
            element.count = value;
            buy_product.push(element);
        }
    });

    let pay = new Map();
    let cheap = [];
    buy_product.forEach(element => {
        if(database.loadPromotions()[0].barcodes.includes(element.barcode) && element.count / 2 > 1){
            pay.set(element.barcode, (element.count - element.count % 2) * element.price);
            cheap.push(element);
        } else {
            pay.set(element.barcode, element.count * element.price);
        }
    });

    let result = '***<没钱赚商店>购物清单***\n';
    buy_product.forEach(element => {
        let temp = '名称：' + element.name + '，数量：' + element.count + element.unit + '，单价：' + element.price.toFixed(2) +'(元)，小计：' + pay.get(element.barcode).toFixed(2) + '(元)\n'
        result += temp;
    });
    result += '----------------------\n挥泪赠送商品：\n';
    let cut = 0;
    cheap.forEach(element => {
        let temp = '名称：' + element.name + '，数量：1' + element.unit + '\n';
        cut += element.price;
        result += temp;
    });
    result += '----------------------\n';
    let sum = 0;
    pay.forEach((value, key, pay) => sum += value);
    result = result + '总计：' + sum.toFixed(2) + '(元)\n节省：' + cut.toFixed(2) +'(元)\n**********************';

    console.log(result);
};