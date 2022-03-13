import Swal from 'sweetalert2'


export const swalService = {
    onDeleteSwal,
    onFilterSwal,
    onDeleteCoreSwal
}


async function onDeleteSwal() {
    await Swal.fire({
        title: 'Delete this board??',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    })
        .then((result) => {

            if (result.isConfirmed) {
                return Promise.resolve()
            } else {
                return Promise.reject()
            }
        })

}

async function onFilterSwal() {
    await Swal.fire({
        title: 'You can\'t make any changes while filter or sort are on, would you like to cancel them?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, clear them!'
    })
        .then((result) => {

            if (result.isConfirmed) {
                return Promise.resolve()
            } else {
                return Promise.reject()
            }
        })

}

async function onDeleteCoreSwal() {
    Swal.fire({
        icon: 'error',
        title: 'This is a "core" board',
        text: 'It is used to showcase our app, therefore changes to it are not allowed. To see full functionality and CRUD please create a new board!',
        footer: '<p>Pro tip: you can always duplicate this board</p>'
    })
}