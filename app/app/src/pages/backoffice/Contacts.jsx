import BackOffice from "../../components/BackOffice";


function Contacts () {

    
    return <BackOffice>
        <div className="h4">Product</div>
        <button  className="btn btn-primary mr-2" data-toggle='modal' data-target='#modalProduct'>
            <i className="fa fa-plus mr-2"></i>  Add Contact
        </button>

        <button  className="btn btn-success"  data-toggle='modal' data-target='#modalExcel'>
            <i class="fa-sharp fa-regular fa-file-excel mr-2"></i>Import form Excle
        </button>
       
    </BackOffice>
};

export default Contacts;
