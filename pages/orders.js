import Layout from "@/components/layout";
import { useEffect, useState } from "react";
import axios from "axios";

export default function OrdersPage() {
    // States and Hooks
    const [orders, setOrders] = useState([]);
    useEffect(() => {
        // Grab the orders from the database via /api/orders.js
        axios.get('/api/orders').then(response => {
            // Each order state is set to the order response data
            setOrders(response.data);
        });
    }, []);
    return (
        <Layout>
            <h1>Orders</h1>
            {/* Table of Orders */}
            <table className="basic">
                {/* Column Headings */}
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Paid</th>
                        <th>Recipient</th>
                        <th>Products</th>
                    </tr>
                </thead>
                {/* Table Body Rows */}
                <tbody>
                    {orders.length > 0 && orders.map(order => (
                        <tr key={order._id}>
                            {/* Date */}
                            <td>{(new Date(order.createdAt)).toLocaleString()}
                            </td>
                            {/* Paid */}
                            <td className={order.paid ? 'text-green-600' : 'text-red-600'}>
                                {order.paid ? 'YES' : 'NO'}
                            </td>
                            {/* Recipient (Object) */}
                            <td>
                                {/* Order Name */}
                                {order.name} {order.email}<br />
                                {/* Order City */}
                                {order.city} {order.postalCode} {order.country}<br />
                                {/* Order Street Address */}
                                {order.streetAddress}
                            </td>
                            {/* Product (Object) */}
                            <td>
                                {order.line_items.map(l => (
                                    <>
                                        {/* Product Price and Quantity */}
                                        {l.price_data?.product_data.name} x
                                        {l.quantity}<br />
                                    </>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
}