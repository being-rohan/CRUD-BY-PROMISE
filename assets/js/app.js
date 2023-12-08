let cl = console.log;

/// posts => create object
//// GET=>dta get from dtatbase
////patch and put=>uppdate
//////delete
let card = document.getElementById('card')
let postformcontrol = document.getElementById('postform');

let titlecontrol = document.getElementById('title');
let bodycontrol = document.getElementById('body');
let useridcontrol = document.getElementById('userid');
cl(useridcontrol)
let updatecontrol = document.getElementById('update');
let addbtn = document.getElementById('addbtn');
let loadercontrol = document.getElementById('loader');






let baseurl = `https://jsonplaceholder.typicode.com`



let posturl = `${baseurl}/posts`
cl(posturl)


///2>configuration


// let xhr = new XMLHttpRequest();


// xhr2.open('GET', xhr);


// xhr2.send()

// let postarry = [];
const onpostcreate = (ele) => {
    ele.preventDefault();
    let newpost = {
        title: titlecontrol.value,
        body: bodycontrol.value,
        userid: useridcontrol.value
    }
    cl(newpost)
    makeapicall("POST", posturl, JSON.stringify(newpost))
        .then((res) => {
            let data4 = JSON.parse(res);
            postarry.push(data4)
            tempalting(postarry)
            cl(postarry)
            swal.fire({
                title: "Good job!",
                text: "post created",
                icon: "success"
            });

        })
        .catch((err) => {
            cl(err)
        })
        .finally(()=>{
            postformcontrol.reset();
        })
}

const edithandler = (ele) => {
    let editedid = ele.closest('.card').id;
    localStorage.setItem('get', editedid)
    let editurl = `${posturl}/${editedid}`
    makeapicall('GET', editurl)
        .then((res) => {
            let dta = JSON.parse(res);
            titlecontrol.value = dta.title,
                bodycontrol.value = dta.body,
                useridcontrol.value = dta.userId
            updatecontrol.classList.remove('d-none')
            addbtn.classList.add('d-none')


        })
        .catch((err) => {
            cl(err)
        })

}
const updatehandler = (ele) => {
    let updateid2 = localStorage.getItem('get');
    cl(updateid2)
    let updateurl = `${posturl}/${updateid2}`

    let newobj = {
        title: titlecontrol.value,
        body: bodycontrol.value,
        userid: useridcontrol.value,
        id: updateid2,

    }

    makeapicall('PUT', updateurl, JSON.stringify(newobj))
        .then((res) => {
            cl(res);
            let dta2 = JSON.parse(res)
            let updatedid = document.getElementById(updateid2);
            cl(updatedid)
            let chil = [...updatedid.children];


            chil[0].innerHTML = `<h2>${dta2.title}</h2>`
            chil[1].innerHTML = `<p>${dta2.body}<p>`
            swal.fire({
                title: "Good job!",
                text: "post updated",
                icon: "success"
            });
        })
        .catch((err) => {
            cl(err)
        })
        .finally(() => {
            updatecontrol.classList.add('d-none');
            addbtn.classList.remove('d-none')
            postformcontrol.reset();
        })

}
const deletehandler = (ele) => {
    let deletid = ele.closest('.card').id;
    let deleteurl = `${baseurl}/posts/${deletid}.json`
    // let getconformation = confirm('are u sure to delete this')
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    })
    // makeapicall('DELETE', deleteurl)
    //     .then((res) => {
    //         document.getElementById(deletid).remove();

    //     })
    .then((result) => {

        if (result.isConfirmed) {

            makeapicall('DELETE', deleteurl)
                .then((res) => {
                    document.getElementById(deletid).remove();

                })
            Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
            });
        }
    })
    .catch((err) => {
        cl(err)
    })
}
const makeapicall = (methodname, apiurl, bodymsg = null) => {
    loadercontrol.classList.remove('d-none')

    return new Promise((resolve, reject) => {

        let xhr = new XMLHttpRequest();

        xhr.open(methodname, apiurl);
        xhr.setRequestHeader('content-type', 'application/json')
        if (bodymsg) {
            xhr.send(bodymsg);
        } else {

            xhr.send();
        }
        // xhr.send(bodymsg);
        xhr.onload = () => {
            loadercontrol.classList.add('d-none')
            if (xhr.status >= 200 && xhr.status <= 299) {
                resolve(xhr.responseText);

            } else {
                reject(xhr.statusText);

            }

        }

        xhr.onerror = function () {
            loadercontrol.classList.add('d-none')


        }


    })



}
makeapicall('GET', posturl)
    .then((res) => {
        let data = JSON.parse(res);
        postarry = data
        cl(data);
        tempalting(data)
        // console.log(postarry);
    })

let tempalting = (arr => {
    let result = ``;
    arr.forEach(ele => {
        result += `  <div class="card mb-4"id="${ele.id}">
                                  <div class="card-header">
                           <h1>
                                  ${ele.title}
                         </h1>
                                </div>
                                           <div class="card-body">
                                              <p>
                                                ${ele.body}
                                            </div>
        <div class="card-footer  d-flex justify-content-between">
            <button class="btn btn-primary" onclick="edithandler(this)"> edit</button>
            <button class="btn btn-danger"onclick="deletehandler(this)"> delete</button>
        </div>
    </div>`
    });
    card.innerHTML = result;
})







postformcontrol.addEventListener('submit', onpostcreate)
updatecontrol.addEventListener('click', updatehandler)