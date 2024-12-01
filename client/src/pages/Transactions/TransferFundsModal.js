import React from 'react'
import { Modal, Form, message } from 'antd'
import { useDispatch, useSelector } from "react-redux"
import { VerifyAccount } from '../../apicalls/transactions';
import { TransferFunds } from '../../apicalls/transactions';


function TransferFundsModal({
    showTransferFundsModal,
    setShowTransferFundsModal,
    reloadData
}) {
    const { user } = useSelector(state => state.users)
    //   console.log(user);
    const [isVerified, setIsVerified] = React.useState('');
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const verifyAccount = async () => {
        try {
            const response = await VerifyAccount({
                receiver: form.getFieldValue("receiver")
            })
            // dispatch(ShowLoading());
            if (response.success) {
                setIsVerified("true");
            }
            else {
                setIsVerified("false");
            }
        } catch (error) {
            // dispatch(HideLoading());
            setIsVerified("false");
        }
    };

    const onFinish = async (values) => {
        console.log(values);
        try {
            // dispatch(ShowLoading());
            const payload = {
                ...values,
                sender: user._id,
                status: "success",
                reference: values.reference || "no reference"
            };
            const response = await TransferFunds(payload);
            if (response.success) {
                reloadData();
                setShowTransferFundsModal(false);
                message.success(response.message);
            }
            else {
                message.error(response.message);
            }
            // dispatch(HideLoading());
        } catch (error) {
            // dispatch(HideLoading());
            message.error(error.message);
        }
    };

    return (
        <div>
            <Modal
                title="Transfer Funds"
                open={showTransferFundsModal}
                onCancel={() => setShowTransferFundsModal(false)}
                // onClose={() => setShowTransferFundsModal(false)}
                footer={null}
            >
                <Form layout='vertical' form={form} onFinish={onFinish}>
                    <div className='flex gap-2 items-center'>
                        
                        <Form.Item label="Account Number" name="receiver" className='w-100'>
                            <input type="text" />
                        </Form.Item>

                        <button className='primary-contained-btn mt-1'
                            type='button' onClick={verifyAccount}>
                            VERIFY
                        </button>
                    </div>

                    {isVerified === "true" && (
                        <div className='success-bg'>
                            Account verified successfully
                        </div>
                    )}
                    {isVerified === "false" && (
                        <div className='error-bg'>
                            Invalid Account
                        </div>
                    )}

                    <Form.Item label="Amount" name="amount"
                        rules={[
                            {
                                required: true,
                                message: "Please input your amount!"
                            },
                            {
                                max: user.balance,
                                message: "Insufficient Balance"
                            }
                        ]}
                    >
                        <input type="number"
                            max={user.balance}
                        />
                    </Form.Item>

                    <Form.Item label="Reference" name="reference" className='w-100'>
                        <textarea type="text" />
                    </Form.Item>

                    <div className='flex gap-1 justify-end'>
                        <button className='primary-outlined-btn'>Cancel</button>
                        {isVerified === "true" && <button className='primary-contained-btn' type='submit'>Transfer</button>}
                    </div>

                </Form>
            </Modal>
        </div>
    )
}

export default TransferFundsModal;