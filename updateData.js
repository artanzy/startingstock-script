const rp = require('request-promise');

// DEV
// const es_info = {
//     host: "e865b4fe9f434efbaa337fd2e30e417c.ap-southeast-1.aws.found.io:9243",
//     user: "elastic",
//     pass: "4KYpEDDrxGod9rddatrxmSKX",
//     index: "dev-arislab-platform"
// }

// ALPHA
// const es_info = {
//     host: "e865b4fe9f434efbaa337fd2e30e417c.ap-southeast-1.aws.found.io:9243",
//     user: "elastic",
//     pass: "4KYpEDDrxGod9rddatrxmSKX",
//     index: "alpha-arislab-platform"
// }

// PROD
// const es_info = {
//     host: "893a21fe51a74190932d97db0d466483.ap-southeast-1.aws.found.io:9243",
//     user: "elastic",
//     pass: "Ptox6rGdRdhr5gajOIZBXZQn",
//     index: "arislab-platform"
// }

// LAB DEV
const es_info = {
    host: "e865b4fe9f434efbaa337fd2e30e417c.ap-southeast-1.aws.found.io:9243",
    user: "elastic",
    pass: "4KYpEDDrxGod9rddatrxmSKX",
    index: "lab-dev-arislab-platform"
}

const updateData = (body, id) => {
    return rp({
        auth: {
            user: es_info['user'],
            pass: es_info['pass']
        },
        uri: `https://${es_info['host']}/${es_info['index']}/product/${id}`,
        body: body,
        method: 'put'
    })
}

rp({
    auth: {
        user: es_info['user'],
        pass: es_info['pass']
    },
    // uri: `https://${es_info['host']}/arislab-platform/store/7d5ea9f8-9bb9-43b1-9e7a-a8a832602d0e`,
    uri: `https://${es_info['host']}/${es_info['index']}/product/_search?size=500`,
    // body: JSON.stringify(richmenuJSON),
    // body: JSON.stringify({
    //     "query": {
    //         "match": {
    //             "productInfo.productBrandName": "Bissin"
    //             // "storeID.keyword": "undefined"
    //         }
    //     }
    // }),
    // body: JSON.stringify({
    //     "query": {
    //         "bool": {
    //             "must_not": [
    //                 { "exists": { "field": "productID" } }
    //             ]
    //         }
    //     }
    // }),
    method: 'get'
})
    .then((resultGet) => {
        resultGet = JSON.parse(resultGet);

        // console.log('resultGet ' , resultGet)

        let hits = resultGet['hits']['hits']

        hits.forEach((resultHits, index) => {
            // console.log('resutlHits ', resultHits['_source'])
            let product = resultHits['_source'];
            let productID = resultHits['_id'];
            let colorIndex;

            // if (product.productInfo.hasOwnProperty('createAt') === false) {
            //     product.productInfo['createAt'] = Date.now();
            // }

            // if (product.productInfo.hasOwnProperty('isDeleted') === false) {
            //     product.productInfo['isDeleted'] = false;
            // }

            // if (product.productInfo.hasOwnProperty('isDelete')) {
            //     delete product.productInfo['isDelete']
            // }

            // product.productInfo.productHashtag = product.productInfo.productHashtag.toLowerCase();

            // if (product.hasOwnProperty('productInfo') && product.productInfo.hasOwnProperty('productVariations')) {
            //     product.productInfo.productVariations.forEach((variation, index) => {
    
            //         colorIndex = index
    
            //         if (variation.hasOwnProperty('size')) {
            //             Object.keys(variation['size']).map((size) => {
            //                 // console.log('size ', size);
            //                 let val = product['productInfo']['productVariations'][colorIndex]['size'][size]['value'];
        
            //                 if (val.hasOwnProperty('price') === false) {
            //                     val['price'] = 0;
            //                 }
        
            //                 if (val.hasOwnProperty('isNotAvailable') === false) {
            //                     val['isNotAvailable'] = false;
            //                 }
        
            //                 if (val.hasOwnProperty('stock') === false) {
            //                     val['stock'] = 0;
            //                 }
        
            //                 if (val.hasOwnProperty('sku') === false) {
            //                     val['sku'] = "";
            //                 }
        
            //                 // console.log('val ', val)
            //                 return val;
            //             });
            //         }
    
            //     });
            // }

            // Start universal template
            // if (product.productInfo.hasOwnProperty('individualProductType') === false) {
            //     product.productInfo['individualProductType'] = "MULTI";
            // }

            // if (product.productInfo.hasOwnProperty('productUniversalInfo') === false) {
            //     product.productInfo['productUniversalInfo'] = {};
            // }

            if (product.productInfo && product.productInfo.hasOwnProperty('productUniversalInfo')) {
                if(isNaN(product['productInfo']['productUniversalInfo']['startingStock'])) 
                    product['productInfo']['productUniversalInfo']['startingStock'] = Number(product['productInfo']['productUniversalInfo']['stock']);
                // product.productInfo['productUniversalInfo']['stock'] = Number(product.productInfo['productUniversalInfo']['stock']);
            }

            if (product.productInfo && product.productInfo.hasOwnProperty('productVariations')) {
                product.productInfo.productVariations.forEach((variation, index) => {
                    colorIndex = index
                    if (variation.hasOwnProperty('size')) {
                        Object.keys(variation['size']).map((size) => {
                            if(isNaN(product['productInfo']['productVariations'][colorIndex]['size'][size]['value']['startingStock']))
                                product['productInfo']['productVariations'][colorIndex]['size'][size]['value']['startingStock'] = Number(product['productInfo']['productVariations'][colorIndex]['size'][size]['value']['stock'])
                        })
                    }
                })
            }
            // End universal template

            // if (product.productInfo.hasOwnProperty('paymentLink') === false) {
                
            //     product['productInfo']['paymentLink'] = ""
            // }

            // if (product.hasOwnProperty('productID') === false || product['productID'] !== productID) {
            //     product['productID'] = productID;
            // }

            // if (product['productID'] !== productID) {
            //     // Find unmatched productID and _id
            //     console.log('productID', productID + ' current is ' + product['productID']);
            // }

            // console.log('product ', JSON.stringify(product));

            updateData(JSON.stringify(product), productID)
                .then((result) => {
                    console.log('resultUpdate is', result);
                })
                .catch((err) => {
                    console.log('update error is ', err);
                })
        });
    })