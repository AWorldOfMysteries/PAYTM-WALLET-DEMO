import React, { useEffect } from 'react'
import PageTitle from '../../components/PageTitle'
import { message, Table } from 'antd';
import TransferFundsModal from './TransferFundsModal';
import { useDispatch, useSelector } from 'react-redux';
import { GetTransactionsOfUser } from '../../apicalls/transactions';
import moment from "moment";
import DepositModal from './DepositModal';

function Transactions() {
    // console.log("hi")
    const [showTransferFundsModal, setShowTransferFundsModal] = React.useState(false);
    const [showDepositModal, setShowDepositModal] = React.useState(false);
    const [data = [], setData] = React.useState([]);
    const dispatch = useDispatch();
    const {user} = useSelector(state => state.users);

    const columns = [
        {
            title: "Date",
            dataIndex: "date",
            render: (text, record) => {
                return moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss A")
            }
        },
        {
            title: "Transaction ID",
            dataIndex: "_id"
        },
        {
            title: "Amount",
            dataIndex: "amount",
        },
        {
            title: "Type",
            dataIndex: "type",
            render: (text, record) => {
                return record.sender._id === user._id ? "Debit" : "Credit";
            }
        },
        {
            title: "Reference Account",
            dataIndex: "",
            render: (text, record) => {
                return record.sender._id === user._id ? (<div>
                    <h1 className='text-sm'>
                        {record.receiver.firstName} {record.receiver.lastName}
                    </h1>
                </div>) : (<div>
                    <h1 className='text-sm'>
                        {record.sender.firstName} {record.sender.lastName}
                    </h1>
                </div>)
            }
        },
        {
            title: "Reference",
            dataIndex: "reference"
        },
        {
            title: "Status",
            dataIndex: "status"
        },
    ];

    const getData = async () => {
        try {
            // dispatch(ShowLoading());
            const response = await GetTransactionsOfUser();
            if(response.success){
                setData(response.data);
                // console.log(data);
            }
            // dispatch(HideLoading());
        } catch (error) {
            // dispatch(HideLoading());
            message.error(error.message);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <div>
            <div className='flex justify-between items-center'>
                <PageTitle title="Transactions" />

                <div className='flex gap-1'>
                    <button className='primary-outlined-btn' onClick={() => setShowDepositModal(true)}>
                        Deposit
                    </button>
                    <button className='primary-contained-btn'
                        onClick={() => setShowTransferFundsModal(true)}
                    >
                        Transfer
                    </button>
                </div>
            </div>

            <Table columns={columns} dataSource={data} className='mt-2' />

            {showTransferFundsModal && <TransferFundsModal
                showTransferFundsModal={showTransferFundsModal}
                setShowTransferFundsModal={setShowTransferFundsModal}
                reloadData={getData}
                />}

            {showDepositModal && <DepositModal
                showDepositModal={showDepositModal}
                setShowDepositModal={setShowDepositModal}
                reloadData={getData}
                />}

        {/* {console.log("helo")} */}
        </div>
    )
}

export default Transactions