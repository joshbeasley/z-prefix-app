/* eslint-disable react/prop-types */
import React, {useContext, useEffect, useState} from 'react'
import UserContext from '../context'
import { InventoryNav } from './InventoryNav';
import BootstrapTable from 'react-bootstrap-table-next';
import config from '../config';
import { ViewItem } from './ViewItem';
import { ArchiveFill } from 'react-bootstrap-icons';

const API_URL = config[process.env.REACT_APP_NODE_ENV || "development"].apiUrl;

export const Inventory = () => {
  const {user} = useContext(UserContext);
  const [items, setItems] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [allItems, setAllItems] = useState(false);

  const columns = [{
    dataField: 'id',
    text: 'ID',
    sort: true
  }, {
    dataField: 'itemName',
    text: 'Name',
    sort: true
  }, {
    dataField: 'tableDescription',
    text: 'Description',
    sort: true
  },{
    dataField: 'quantity',
    text: 'Quantity',
    sort: true
  },{
    dataField: 'manager',
    text: 'Manager',
    sort: true
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
        if (!allItems && user) {
          data = data.filter(item => item.userId === user.id);
        }

        if (!user) {
          setAllItems(true);
        }
        
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
        <InventoryNav toggleRefresh={toggleRefresh} allItems={allItems} setAllItems={setAllItems}/>
        <div className="empty-inventory">
          <h3 className='mt-4'>Welcome to</h3>
          <h1 className='mb-5'><ArchiveFill className="login-logo"/>TIMS</h1>
          <h3>Hello {user ? user.firstName: "Guest"}! {user ? <span>There are no items in the inventory currently under your management. <br/> You can add an item or see all items using the buttons in the navigation bar</span> :
                                                       <span>There are no items in the inventory</span>}</h3>
        </div>
      </>
    )
  }

  return (
    <>
      <InventoryNav toggleRefresh={toggleRefresh} allItems={allItems} setAllItems={setAllItems}/>
      <div>
        <BootstrapTable 
          keyField="id" 
          data={items} 
          columns={columns}
          bootstrap4
          className='table' 
          striped
          hover
          defaultSorted={[{dataField: 'id', order: 'asc'}]}
          defaultSortDirection='asc'
        />
      </div>
    </>
  )

  
}

