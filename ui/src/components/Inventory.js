import React, {useContext, useEffect, useState} from 'react'
import UserContext from '../context'
import { InventoryNav } from './InventoryNav';
import { AddItemForm } from './AddItemForm';
import BootstrapTable from 'react-bootstrap-table-next';
import config from '../config'

const API_URL = config[process.env.REACT_APP_NODE_ENV || "development"].apiUrl;

const columns = [{
  dataField: 'id',
  text: 'ID'
}, {
  dataField: 'itemName',
  text: 'Name'
}, {
  dataField: 'description',
  text: 'Description'
},{
  dataField: 'quantity',
  text: 'Quantity'
}];

export const Inventory = () => {
  const {user} = useContext(UserContext);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const getItems = async () => {
      try {
        const res = await fetch(API_URL + `/items?user=${user.id}`);
        const data = await res.json();
        setItems(data);
      } catch(err) {
        console.log(err)
      }
    }
    getItems();
  }, [])

  if (items.length === 0) {
    return (
      <>
        <InventoryNav/>
        <div className="empty-inventory">
          <h3>Hello {user.firstName}! There are no items in the inventory currently under your management. <br/> Would you like to add an item?</h3>
          <AddItemForm/>
        </div>
      </>
    )
  }

  return (
    <>
      <InventoryNav/>
      <div>
        <BootstrapTable keyField="id" data={items} columns={columns}/>
      </div>
    </>
  )

  
}

