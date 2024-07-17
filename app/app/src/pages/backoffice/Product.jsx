import { useEffect, useState } from "react";
import BackOffice from "../../components/BackOffice"
import MyModal from "../../components/MyModal";
import Swal from "sweetalert2";
import axios from "axios";
import config from "../../config";

function Product() {
    const [product, setProduct] = useState({});
    const [products, setProducts] = useState({});
    const [img, setImg] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpload = async () => {
        try {
            const formData = new FormData();
            formData.append('img', img);

            const res = await axios.post(config.apiPath + '/product/upload', formData, {
                headers: {
                    'Content-Type' : 'multipart/form-data',
                    'Authorization': localStorage.getItem('token')
                }
            })
            
            if (res.data.newName !== undefined) {
                return res.data.newName;
            }
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    const handleSave = async () => {
        try {
            product.img = await handleUpload();
            product.price = parseInt(product.price);
            product.cost = parseInt(product.cost);

            let res;

            if (product.id === undefined) {
                res = await axios.post(config.apiPath + '/product/create', product, config.headers());
            } else {
                res = await axios.put(config.apiPath + '/product/update', product, config.headers());
            }
            if (res.data.message === 'success') {
                Swal.fire({
                    title: 'save',
                    text: 'success',
                    icon: 'success',
                    timer: 2000
                })
                document.getElementById('modalProduct_btnClose').click();
                fetchData();

                setProduct({ ...product,id :undefined });
            }
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    const fetchData = async () => {
        try {
            const res = await axios.get(config.apiPath + '/product/list', config.headers());

            if (res.data.results !== undefined) {
                setProducts(res.data.results);
            }
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    const clearForm = () => {
        setProduct({
            name: '',
            price:'',
            cost: ''
        })
    }

    const heandleRemove = async (item) => {
        try {
            const button = await Swal.fire({
                text: 'remove item',
                title: 'remove',
                showCancelButton: true,
                showConfirmButton: true
            })

            if (button.isConfirmed) {
                const res = await axios.delete(config.apiPath + '/product/remove/' + item.id, config.headers());

                if (res.data.message === 'success') {
                    Swal.fire({
                        title: 'remove',
                        text: 'remove success',
                        icon: 'success',
                        timer: 2000
                    })

                    fetchData();
                }
            }
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    const selectedFile = (inputFile) => {
        if (inputFile !== undefined) {
            if (inputFile.length > 0){
                setImg(inputFile[0]);
            }
        }
    }


    return <BackOffice>
        <div className="h4">Product</div>
        <button onClick={clearForm} className="btn btn-primary mr-2" data-toggle='modal' data-target='#modalProduct'>
            <i className="fa fa-plus mr-2"></i>  Add item
        </button>

        <button className="btn btn-success">
            <i class="fa-sharp fa-regular fa-file-excel mr-2"></i>Import form Excle
        </button>


        <table className="nt-3 table table-brodered table-striped">
            <thead>
                <tr>
                    <th>Product IMG</th>
                    <th>name</th>
                    <th width='150px' className="text-right">cost</th>
                    <th width='150px' className="text-right">price</th>
                    <th width='140px'></th>
                </tr>
            </thead>
            <tbody>
                { products.length > 0 ? products.map(item =>
                    <tr key={item.id}>
                        <td>{item.img !== undefined ? 
                            <img className="img-thumbnail width_img" src={config.apiPath + '/uploads/' + item.img}/>
                            : <></>}
                        </td>
                        <td>{item.name}</td>
                        <td className="text-right">{item.cost}</td>
                        <td className="text-right">{item.price}</td>
                        <td className="text-center">
                            <button className="='btn btn-primary mr-2" data-toggle='modal' data-target='#modalProduct' onClick={e => setProduct(item)}>
                                <i class="fa-duotone fa-pen-to-square"></i>
                            </button>
                            <button className="btn btn-danger" onClick={e => heandleRemove(item)}>
                                <i className="fa-regular fa-xmark"></i>
                            </button>
                        </td>
                    </tr>
                ) : <></>}
            </tbody>
        </table>

        <MyModal id='modalProduct' title='Product'>
            <div>
                Product name
                <input value={product.name} className="form-control" onChange={e => setProduct({ ...product, name: e.target.value })}/>
            </div>
            <div>
                <div className="mt-3">
                    Cost
                    <input value={product.cost} className="form-control" onChange={e => setProduct({...product, cost: e.target.value })}/>
                </div>
                <div className="mt-3">
                    price
                    <input value={product.price} className="form-control" onChange={e => setProduct({ ...product, price: e.target.value })}/>
                </div>
                <div className="mt-3">
                    Product img
                    <input className="form-control" type="file" onChange={e => selectedFile(e.target.files)} />
                </div>
            </div>
            <div className="mt-3">
                <button className="btn btn-primary" onClick={handleSave}>
                    <i className="fa fa-check mr-2"></i>Save
                </button>
            </div>
        </MyModal>
    </BackOffice>
}

export default Product;