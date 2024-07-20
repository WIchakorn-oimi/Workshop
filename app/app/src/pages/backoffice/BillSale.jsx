import { useEffect, useState } from "react";
import BackOffice from "../../components/BackOffice"
import Swal from "sweetalert2";
import axios from "axios";
import config from "../../config";
import dayjs from 'dayjs';
import MyModal from "../../components/MyModal";



function BillSale() {

    const [billSales, setBillSales ] = useState([]);
    const [billSaleDetails, setBillSalesDetails] = useState([]);
    const [sumPrice, setSumPrice] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(config.apiPath + '/api/sale/list', config.headers());

            if (res.data.results !== undefined) {
                setBillSales(res.data.results);
            }
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    const openModalInfo = async (item) => {
        try {
            const res = await axios.get(config.apiPath + '/api/sale/billInfo/' + item.id, config.headers())

            let mySumPrice =0;
            if (res.data.results !== undefined){
                setBillSalesDetails(res.data.results);

                for (let i = 0; i < res.data.results.length; i++) {
                    mySumPrice += parseInt(res.data.results[i].price);
                }
                setSumPrice(mySumPrice);
            }

        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    const handlePay = async (item) => {
        try{
            const button = await Swal.fire({
                title: 'ยืนยันการชำระเงิน',
                text: 'คุณได้รับการชำระเงิน',
                icon: 'question',
                showCancelButton: true,
                showConfirmButton: true,
            });

            if (button.isConfirmed) {
                const res = await axios.get(config.apiPath + '/api/sale/updateStatusToPay/' + item.id, config.headers());

                if (res.data.message === 'success') {
                    Swal.fire({
                        title: 'Save',
                        text: 'บันทึกข้อมูลแล้ว',
                        icon: 'success',
                        timer: 1000
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

    const handlesend = async (item) => {
        try{
            const button = await Swal.fire({
                title: 'ยืนยันการจัดส่งสิ้นค้า',
                text: 'คุณต้องการบัททึกว่าจัดส่ง',
                icon: 'question',
                showCancelButton: true,
                showConfirmButton: true,
            });

            if (button.isConfirmed) {
                const res = await axios.get(config.apiPath + '/api/sale/updateStatusTosend/' + item.id, config.headers());

                if (res.data.message === 'success') {
                    Swal.fire({
                        title: 'Save',
                        text: 'บันทึกข้อมูลแล้ว',
                        icon: 'success',
                        timer: 1000
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

    const handlecancel= async (item) => {
        try{
            const button = await Swal.fire({
                title: 'ยกเลิก',
                text: 'คุณต้องการยกเลิกสิ้นค้า',
                icon: 'cancel',
                showCancelButton: true,
                showConfirmButton: true,
            });

            if (button.isConfirmed) {
                const res = await axios.get(config.apiPath + '/api/sale/updateStatusTocancel/' + item.id, config.headers());

                if (res.data.message === 'success') {
                    Swal.fire({
                        title: 'Save',
                        text: 'บันทึกข้อมูลแล้ว',
                        icon: 'success',
                        timer: 1000
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

    const displayStatusText = (item) => {
        if (item.status === 'wait'){
            return <div className="badge bg-dark">รอตรวจสอบ</div>
        }else if (item.status === 'pay') {
            return <div className="badge bg-success">ชำระแล้ว</div>
        }else if (item.status === 'send') {
            return <div className="badge bg-info">จัดส่งแล้ว</div>
        }else if (item.status === 'cancel') {
            return <div className="badge bg-danger">ยกเลิก</div>
        }
    }    

    return<BackOffice>
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">Sales Report</div>
                    </div>
                    <div className="card-body">
                        <table className="table table-bordered table-striped">
                            <thead>
                                <th>ลูกค้า</th>
                                <th width='200px'>เบอร์โทร</th>
                                <th width='200px'>ที่อยู่</th>
                                <th width='200px'>วันที่ชำระเงิน</th>
                                <th>เวลา</th>
                                <th>สถานะ</th>
                                <th width='460px'></th>
                            </thead>
                            <tbody>
                                {billSales.length > 0 ? billSales.map(item => 
                                    <tr key = {item.id}>
                                        <td>{item.customerName}</td>
                                        <td>{item.customerPhone}</td>
                                        <td>{item.customerAddress}</td>
                                        <td>{dayjs(item.payDate).format('DD/MM/YYYY')}</td>
                                        <td>{item.payTime}</td> 
                                        <td>{displayStatusText(item)}</td>
                                        <td className="text-center">
                                            <button className="btn btn-secondary mr-1" data-toggle='modal' data-target="#modalInfo" onClick={e => openModalInfo(item)}>
                                                <i className="fa fa-file-list mr-2"></i>รายการ
                                            </button>
                                            <button className="btn btn-info mr-1" onClick={e => handlePay(item)}>
                                                <i className="fa fa-cheack mr-2"></i>ได้รับการชำระแล้ว
                                            </button>
                                            <button className="btn btn-success mr-1" onClick={e => handlesend(item)}>
                                                <i className="fa fa-file mr-2"></i>จัดส่งแล้ว
                                            </button>
                                            <button className="btn btn-danger" onClick={e => handlecancel(item)}>
                                                <i className="fa fa-time mr-2"></i>ยกเลิก
                                            </button>
                                        </td>
                                        <td></td>
                                    </tr>
                                ): <></>}
                            </tbody>
                        </table>
                    </div>
                </div>

                <MyModal id="modalInfo" title="of the bill">
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>รายการ</th>
                                <th className="text-right">ราคา</th>
                                <th className="text-right">จำนวน</th>
                            </tr>
                        </thead>
                        <tbody>
                            { billSaleDetails.length > 0 ? billSaleDetails.map(item =>
                                <tr key={item.id}>
                                    <td>{item.product.name}</td>
                                    <td className="text-right">{parseInt(item.price).toLocaleString('th-TH')}</td>
                                    <td className="text-right">1</td>
                                </tr>
                            ) : <></>}
                        </tbody>
                    </table>
                    <div className="text-center mt-3">
                        ยอดรวม {sumPrice.toLocaleString('th-TH')}
                    </div>
                </MyModal>
    </BackOffice>
}
export default BillSale;