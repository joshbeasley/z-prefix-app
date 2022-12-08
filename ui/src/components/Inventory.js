import React, {useContext, useEffect, useState} from 'react'
import UserContext from '../context'
import { InventoryNav } from './InventoryNav';
import { AddItemForm } from './AddItemForm';
import BootstrapTable from 'react-bootstrap-table-next';
import config from '../config';
import { ViewItem } from './ViewItem';

const API_URL = config[process.env.REACT_APP_NODE_ENV || "development"].apiUrl;

export const Inventory = () => {
  const {user} = useContext(UserContext);
  const [items, setItems] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const columns = [{
    dataField: 'id',
    text: 'ID'
  }, {
    dataField: 'itemName',
    text: 'Name'
  }, {
    dataField: 'tableDescription',
    text: 'Description'
  },{
    dataField: 'quantity',
    text: 'Quantity'
  },{
    dataField: 'manager',
    text: 'Manager'
  },{
    dataField: "buttonId",
    text: 'View',
    formatter: (cell) => {
      let item = items.filter(item => item.id === cell);
      item = item[0]
      return (
        <ViewItem item={item} toggleRefresh={toggleRefresh}/>
      );
    }
  }];
  

  const columnsAuth = [{
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
  },{
    dataField: "buttonId",
    text: 'View',
    formatter: (cell) => {
      let item = items.filter(item => item.id === cell);
      item = item[0]
      return (
        <ViewItem item={item} toggleRefresh={toggleRefresh}/>
      );
    }
  }];

  useEffect(() => {
    const getItems = async () => {
      try {
        const res = await fetch(API_URL + `/items`, {
          credentials: "include",
        });
        let data = await res.json();
        data = data.map(item => {
          return {...item, 
                  manager: item.lastName + ", " + item.firstName, 
                  tableDescription: item.description.length > 100 ? 
                               item.description.slice(0, 100) + "..." : 
                               item.description,
                  buttonId: item.id}
        })
        
        setItems(data);
      } catch(err) {
        console.log(err)
      }
    }
    getItems();
  }, [refresh])

  const toggleRefresh = () => {
    let newRefresh = !refresh;
    setRefresh(newRefresh);
  };

  if (items.length === 0) {
    return (
      <>
        <InventoryNav toggleRefresh={toggleRefresh}/>
        <div className="empty-inventory">
          <h3>Hello {user ? user.firstName: "Guest"}! There are no items in the inventory currently under your management. <br/> Would you like to add an item?</h3>
          <AddItemForm/>
        </div>
      </>
    )
  }

  return (
    <>
      <InventoryNav toggleRefresh={toggleRefresh}/>
      <div>
        <BootstrapTable keyField="id" data={items} columns={user ? columnsAuth : columns}/>
      </div>
    </>
  )

  
}

