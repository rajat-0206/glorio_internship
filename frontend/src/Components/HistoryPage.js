import { React } from "react";
import { Table, Tag, Space } from 'antd';

const HistoryPage = () => {

    const columns = [
        {
            "_id": "60ce2cc5f5f89d23580de042",
            "user": "rajat123468@gmail.com",
            "parking_time": "Sat Jun 19 2021 23:13:33 GMT+0530 (India Standard Time)",
            "charges": 160,
            "slot": "Building A slot 1",
            "unpark_time": "Sun Jun 20 2021 00:30:36 GMT+0530 (India Standard Time)"
        },
        {
            "_id": "60ce2ce0f5f89d23580de043",
            "user": "rajat123468@gmail.com",
            "parking_time": "Sat Jun 19 2021 23:14:00 GMT+0530 (India Standard Time)",
            "charges": 160,
            "slot": "Building A slot 2",
            "unpark_time": "Sun Jun 20 2021 00:37:38 GMT+0530 (India Standard Time)"
        },
        {
            "_id": "60ce2cfcf5f89d23580de044",
            "user": "rajat123468@gmail.com",
            "parking_time": "Sat Jun 19 2021 23:14:28 GMT+0530 (India Standard Time)",
            "charges": 160,
            "slot": "Building B slot 2",
            "unpark_time": "Sun Jun 20 2021 00:33:45 GMT+0530 (India Standard Time)"
        },
        {
            "_id": "60ce40986d87a60bd483b7c4",
            "user": "rajat123468@gmail.com",
            "parking_time": "Sun Jun 20 2021 00:38:08 GMT+0530 (India Standard Time)",
            "charges": 100,
            "slot": "Building B slot 2",
            "unpark_time": "Sun Jun 20 2021 00:40:17 GMT+0530 (India Standard Time)"
        }
    ];

    const columnName = [
        {
            title: 'Booking Id',
            dataIndex: '_id',
            key: 'id',
          },
          {
            title: 'Parked On',
            dataIndex: 'parking_time',
            key: 'parking_time',
          },
          {
            title: 'Unparked On',
            dataIndex: 'unpark_time',
            key: 'unpark_time',
          },
          {
            title: 'Slot',
            dataIndex: 'slot',
            key: 'slot',
          },
          {
            title: 'Cost',
            dataIndex: 'charges',
            key: 'charges',
          },
          
    ]

    return (<Table  dataSource={columns} columns={columnName} />);
}

export default HistoryPage;