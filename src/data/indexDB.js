

//indexDB
var db;
var request = window.indexedDB.open('starnet', 1);
request.onsuccess=(e)=>{
    db=request.result;
    console.log('indexDB打开成功')
    db.transaction(['texture'],'readwrite').objectStore('texture').add({content:'hello'})

}
request.onupgradeneeded=(e)=>{
    db=request.result;
    var objectStore;

    //定义texture表
    if (!db.objectStoreNames.contains('texture')) {
        objectStore = db.createObjectStore('texture', { autoIncrement: true });
        objectStore.createIndex('name','name',{unique:true})
    }
    //....
}

//conver array to dataurl
function addTexture(array){
    db.transaction(['texture'],'readwrite').objectStore('texture').add({content:array})

}

