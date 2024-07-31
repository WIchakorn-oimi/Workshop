import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import axios from 'axios';
import config from "../config";
import MyModal from "../components/Mymodal";
import dayjs from 'dayjs';

function Index() {

    const [products, setProducts] = useState([]);
    const [carts, setCaet] = useState([]);
    const [recordInCarts, setRecordInCarts] = useState(0);
    const [sumQty, setSumQty] = useState(0);
    const [sumprice, setSumprice] =useState(0);
    const [customerName,setCustomerName] = useState('');
    const [customerPhone,setCustomerPhone] = useState('');
    const [customerAddress,setCustomerAddress] = useState('');
    const [payDate,setPayDate] = useState(dayjs(new Date()).format('YYYY-MM-DD'))
    const [payTime, setPaytime] = useState('')


    useEffect(() => {
            fetchData();
            fatchDataFromLocal();
    }, []);

    const fatchDataFromLocal = () => {
        const itemInCarts = JSON.parse(localStorage.getItem('carts'));
        if (itemInCarts !== null) {
            setCaet(itemInCarts);
            setRecordInCarts(itemInCarts !== null ? itemInCarts.length : 0 );

            computePriceAndQty(itemInCarts);
        }
    }

    const fetchData = async () => {
        try {
            const res = await axios.get(config.apiPath + '/product/list');

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

    function showImage(item) {
        if (item.img !== undefined) {
            let imgPath = config.apiPath + '/uploads/' + item.img;

            if (item.img === "") imgPath = "defaultImage.jpg";
                
            return <img className="card-img-top" height="150px" width="130px" src={imgPath} alt=""/>
        }
        
        return <></>;
    }

    const addtoCart = (item) => {
        let arr = carts;

        if (arr === null) {
            arr = [];
        }

        arr.push(item);

        setCaet(arr);
        setRecordInCarts(arr.length)

        localStorage.setItem('carts', JSON.stringify(carts));

        fatchDataFromLocal();
    }

    const computePriceAndQty = (itemInCarts) => {
        let sumQty = 0;
        let sumprice = 0;

        for (let i =0; i< itemInCarts.length; i++) {
            const item = itemInCarts[i];
            sumQty++;
            sumprice += parseInt(item.price);
        }

        setSumprice(sumprice);
        setSumQty(sumQty);
    }

    const handleRemove = async (item) => {
        try {
            const button = await Swal.fire({
                title: 'Delete',
                text: "คุณต้องการสิ้นค้าออกจากตะกร้าหรือไม่ ?",
                icon: "question",
                showCancelButton:'true',
                showConfirmButton: true
            })

            if (button.isConfirmed){
                let arr = carts;

                for (let i  = 0; i < arr.length; i++) {
                    const itemInCarts = arr[i];

                    if (item.id === itemInCarts.id) {
                        arr.splice(i,1);
                    }
                }

                setCaet(arr);
                setRecordInCarts(arr.length);

                localStorage.setItem('carts', JSON.stringify(arr));
                computePriceAndQty(arr);
            }
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    const handlesave = async () => {
        try {
            const payload = {
                customerName: customerName,
                customerPhone: customerPhone,
                customerAddress:customerAddress,
                payDate: payDate,
                payTime: payTime,
                carts: carts

            }

            const res = await axios.post(config.apiPath + '/api/sale/save', payload);

            if (res.data.message === 'success') {
                localStorage.removeItem('carts');
                setRecordInCarts(0);
                setCaet([]);

                Swal.fire({
                    title: 'บันทึกข้อมูล',
                    text: 'ระบบบันทึกข้อมูลเรียบร้อย',
                    icon: 'success'   
                })
                
                document.getElementById("modalCart_btnClose").click();
                setCustomerName('');
                setCustomerPhone('');
                setCustomerAddress('');
                setPayDate(new Date());
                setPaytime('');
                
            }
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }
   

    return <>
        <div className="container mt-3">
            <div className="float-start">
                <div className="h3">shop products</div>
            </div>
            <div className="float-end">
               <button 
               data-bs-toggle="modal" 
               data-bs-target="#modalCart" 
               className="btn btn-outline-dark" >
                    <i className="fa-solid fa-cart-shopping me-2"></i>
                    {recordInCarts}
                </button> 
            </div>
            <div className="clearfix"></div>
            <div className="row">
                { products.length > 0 ? products.map(item => 
                    <div className="col-3 mt-3" key={item.id}>
                        <div className="card">
                            {showImage(item)}
                            <div className="card-body">
                                <div>{item.name}</div>
                                <div>{item.price.toLocaleString('th-TH')}</div>
                                <div className="text-center">
                                    <button className="btn btn-outline-success" onClick={e => addtoCart(item)} >
                                        <i className="fa fa-shopping-cart me-2"></i>
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ):<></>}
            </div>
        </div>

        <MyModal id="modalCart" title="Your Cart">
                <table className="table table-bordered table-stripad">
                    <thead>
                        <tr>
                            <th>name</th>
                            <th className="text-end">price</th>
                            <th className="text-end">qty</th>
                            <th width="60px"></th>
                        </tr>
                    </thead>
                    <tbody>
                        { carts.length > 0 ? carts.map(item =>  
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td className="text-end">{item.price.toLocaleString('th-TH')}</td>
                                <td className="text-end">1</td>
                                <td className="text-center">
                                    <button className="btn btn-danger" onClick={e => handleRemove(item)}>
                                        <i className="fa fa-times"></i>
                                    </button>
                                </td>
                            </tr>
                        ): <></>}
                    </tbody>
                </table>

                <div className="text-center">
                    Qty {sumQty} price {sumprice} Bath 
                </div>

                <div className="alert alert-info">
                    <div>Please transfer money to the account.</div>
                    <div>Kasikorn wichakorn kamonsangmanee 1123-451-23213</div>
                </div>

                <div className="mt-3">
                    <div>
                        <div>Name</div>
                        <input className="form-control" onChange={e => setCustomerName(e.target.value)}/>
                    </div>
                    <div>
                        <div>telephone number</div>
                        <input className="form-control"  onChange={e => setCustomerPhone(e.target.value)}/>
                    </div>
                    <div>
                        <div>Address</div>
                        <input className="form-control"  onChange={e => setCustomerAddress(e.target.value)}/>
                    </div>
                    <div>
                        <div>Transfer date</div>
                        <input className="form-control" type="date" value={payDate} onChange={e => setPayDate(e.target.value)}/>
                    </div>
                    <div>
                        <div>Transfer time</div>
                        <input className="form-control" value={payTime} onChange={e => setPaytime(e.target.value)}/>
                    </div>
                    <button className=" btn btn-primary mt-3" onClick={handlesave}>
                        <i className="fa fa-check me-2"></i>ยืนยันการซื้อ 
                    </button>
                </div>
        </MyModal>
    </>
}

export default Index;