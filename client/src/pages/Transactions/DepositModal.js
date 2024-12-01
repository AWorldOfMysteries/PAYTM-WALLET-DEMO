import React from 'react'
import { Modal, Form, message } from 'antd'
import StripeCheckout from 'react-stripe-checkout'
import { DepositFunds } from '../../apicalls/transactions'

function DepositModal({
    showDepositModal,
    setShowDepositModal,
    reloadData
}) {

    // const dispatch = useDispatch()
    const onToken = async (token) => {
        try {
            // console.log("hello")
            // dispatch(ShowLoading());
            const response = await DepositFunds({
                token,
                amount: form.getFieldValue("amount")
            });
            // dispatch(HideLoading());
            if(response.success){
                reloadData();
                setShowDepositModal(false);
                message.success(response.message);
            }
            else{
                message.error(response.message);
            }
        } catch (error) {
            // dispatch(HideLoading());
            message.error(error.message);
        }
    }

    const [form] = Form.useForm();

    return (
        <Modal
            title="Deposit"
            open={showDepositModal}
            onCancel={() => setShowDepositModal(false)}
            footer={null}
        >
            <div className='flex-col gap-1'>
                <Form layout='vertical' form={form}>
                    <Form.Item label='Amount' name='amount'
                        rules={[
                            {
                            required: true,
                            message: "Please input amount"
                            }
                        ]}
                    >
                        <input type='number'/>
                    </Form.Item>
                    <div className='flex justify-end gap-1'>
                        <button className='primary-outlined-btn'>
                            Cancel
                        </button>
                        <StripeCheckout
                            currency='USD'
                            token={onToken}
                            amount={
                                form.getFieldValue("amount")*100
                            }
                            shippingAddress
                            stripeKey="pk_test_51QE10IJgeMqjruacTOmODzVtdFSrKe4TLiISu1dsGTO1K13QNoFVS2gDOBdqkZinHMi2esxXDwFGAce1EV8YDH33006V97lpPf"
                        >

                        <button className='primary-contained-btn'>
                            Deposit
                        </button>
                        </StripeCheckout>
                    </div>
                </Form>
            </div>
        </Modal>
    )
}

export default DepositModal