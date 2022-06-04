import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import { Order_Service,Auth_Service,Item_Service } from '../../services/Service';
import { Bar,Pie,Doughnut} from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js';
import {
    FaUserFriends,
    FaEye,
    FaGift,
    FaBook
} from "react-icons/fa";
Chart.register(...registerables);



function Dashboard() {
    const [admin, setAdmin]= useState({});
    const [users, setUsers]= useState([]);
    const [allOrders, setAllorders] = useState([]);
    const [months, setMonths] = useState([]);
    const [noOfOrders, setNoOfOrders] = useState([]);
    const [deliveredOrders, setDeliveredOrders]= useState();
    const [revenueGeneratedPerMonth, setRevenueGeneratedPerMonth ]=useState([]);
    const [books,setBooks]=useState([]);
    const [inStock,setInStock]=useState();
    const [outOfStock,setOutOfStock]=useState();
    let user_admin = JSON.parse(localStorage.getItem("user"));
    
    let xAxis = {
        display: true,
        title: {
          display: true,
          text: 'Month (2022)',
          color: '#911',
          font: {
            family: 'Comic Sans MS',
            size: 18,
            weight: 'bold',
            lineHeight: 1.2,
          },
          padding: {top: 10, left: 0, right: 0, bottom: 0}
        }
      }
      let yAxis = {
        min: 0,
        max: 10,
        beginAtZero: true,
        display: true,
        title: {
        display: true,
        text: '# of Orders',
        color: '#150',
        font: {
            family: 'Comic Sans MS',
            size: 18,
            style: 'normal',
            lineHeight: 1.2
        },
        padding: {top: 5, left: 0, right: 0, bottom: 0}
        }
     }
    let yAxisForRevenueGenerated = {
        min: 0,
        // max: 10000,
        ticks: {
          // Include a rupee sign in the ticks
          callback: function(value, index, ticks) {
              return '₹' + value;
          }
        },
        beginAtZero: true,
        display: true,
        title: {
        display: true,
        text: 'Amount (in Rupees)',
        color: '#350',
        font: {
            family: 'Comic Sans MS',
            size: 18,
            style: 'normal',
            lineHeight: 1.2
        },
        padding: {top: 5, left: 0, right: 0, bottom: 5}
        }
      }
    //   let charTitle = {
    //     title: {
    //       display: true,
    //       text: 'Orders placed per month',
    //       font: {
    //         size: 16
    //       }
    //     }
    // }
      let charTitleForRevenueGenerated = {
        tooltip: {
          callbacks: {
              label: function(context) {
                  let label = context.dataset.label || '';
    
                  if (label) {
                      label += ': ';
                  }
                  if (context.parsed.y !== null) {
                      label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'INR' }).format(context.parsed.y);
                  }
                  return label;
              }
          }
        }
      }
      let bgColorArray = [
        'rgba(175,142,192,1)',
        'rgba(255,132,122,1)',
        'rgba(105,162,150,1)',
        'rgba(68,90,118,1)',
        'rgba(240,100,150,1)',
        'rgba(115,142,101,1)',
        'rgba(215,132,122,1)',
        'rgba(175,162,250,1)',
        'rgba(168,90,184,1)',
        'rgba(200,120,150,1)',
        'rgba(218,90,138,1)',
        'rgba(220,14,170,1)'  
    ]
    let bgColorArrayForRevenueGenerated = [
      'rgba(165,12,102,1)',
      'rgba(235,102,121,1)',
      'rgba(175,162,159,1)',
      'rgba(168,90,108,1)',
      'rgba(230,100,190,1)',
      'rgba(115,142,101,1)',
      'rgba(95,132,122,1)',
      'rgba(15,166,200,1)',
      'rgba(168,190,164,1)',
      'rgba(200,120,150,1)',
      'rgba(218,90,138,1)',
      'rgba(220,14,170,1)'  
  ]
    useEffect(()=>{
        localStorage.removeItem("OrderId");
        window.scrollTo(0,0);
        if(user_admin && user_admin.role==="admin"){
            setAdmin(user_admin);
            getAllOrders(user_admin.token);
            getAllUsers(user_admin.token);
            getAllBooks();
        }
    },[]);
    const getAllBooks = async()=>{
        const response = await Item_Service.getAllBooks();
        // console.log(response.status);
        if(response.status === 200){
            const books = await response.json();
            // console.log(books);
            let in_stock=0;
            let out_of_Stock=0;
            setBooks(books);
            books.forEach((item)=>{
                if(item.stock_details.count_in_stock>0)
                    in_stock = in_stock+item.stock_details.count_in_stock;
                else if(item.stock_details.count_in_stock === 0){
                    out_of_Stock = out_of_Stock+1;
                }
            })
            setInStock(in_stock);
            setOutOfStock(out_of_Stock);
        }else if(response.status === 400){
            console.log("Bad Request");
        }
    }
    const getAllUsers = async (token) => {
        const response = await Auth_Service.getUsers(token);
        if(response.status === 200){
          const usersReturned = await response.json();
          let onlyUsers = [];
          usersReturned.forEach((user) => {
            if (user.role !== "admin") {
              onlyUsers.push(user);
            }
          });
          // console.log(onlyUsers);
          setUsers(onlyUsers)
        }else if(response.status === 204){
            setUsers(null);
        }else if(response.status === 400 ){
          // setShowLoader(false);
          console.log("Bad Request");
        }
        
    }
    const getAllOrders = async(token)=>{
        const response = await Order_Service.getAllOrders(token);
        if(response.status === 200){
            const returnedOrders = await response.json();
            // console.log(returnedOrders);
            let monthsSet = new Set([]);
            let deliveredOrderCount = 0;
            returnedOrders.forEach((order)=>{
                let date = new Date(order.date);
                let monthNumber = date.getMonth()+1;
                let month = convertToMonth(monthNumber);
                monthsSet.add(month);
                if(order.delivery_status === "Delivered"){
                    deliveredOrderCount+=1;
                }
            }); 
            // console.log(deliveredOrderCount);
            setDeliveredOrders(deliveredOrderCount);

            let monthsArr = [...monthsSet];    //converting set to array
            setMonths(monthsArr);
            setAllorders(returnedOrders);
            filterByDate(returnedOrders);
        }else if (response.status === 204){
            setAllorders(null);
            console.log("No orders found");
        }else {
            console.log("There was some error while fetching orders");
        }
    }
    const filterByDate = (orders)=>{
        // let datesArr = [];
        let numberOfOrderArr = []; //per month
        // numberOfOrderArr[0] = ['']
        let revenuePerMonth = [];
        let j=0;
        [...Array(12)].forEach((order,index)=>{ 
            index=index+1;
            let count=0;   
            let amt=0; 
            let found=false;
            for(let i=j; i<orders.length; i++){
                let date = new Date(orders[i].date);
                let monthNumber = date.getMonth()+1;
                // let year = date.getFullYear();
                // console.log(year)
                if( index === monthNumber){
                    if(orders[i].payment_status === "Paid"){
                        amt+=orders[i].total_amount;
                      }
                    count++;
                    found = true;
                }else{
                    j=i;
                    break;
                }
                if(found === true){
                    revenuePerMonth[index-1] = amt;
                    numberOfOrderArr[index-1]=count;
                    found = false;
                }
            }
        });
        // console.log(numberOfOrderArr);
        setRevenueGeneratedPerMonth(revenuePerMonth);
        setNoOfOrders(numberOfOrderArr); 
    }  
    

    const convertToMonth = (monthNumber)=>{
        let month="";
        switch (monthNumber) {
            case 1:
              month = "January";
              break;
            case 2:
              month = "February";
              break;
            case 3:
                month = "March";
              break;
            case 4:
                month = "April";
              break;
            case 5:
                month = "May";
              break;
            case 6:
                month = "June";
              break;
            case 7:
                month = "July";
            case 8:
                month = "August";
                break;
            case 9:
                month = "September";
                break;
            case 10:
                month = "October";
                break;
            case 11:
                month = "November";
                break;
            case 12:
                month = "December";
          }
          return month;
    }
  return (
    
    <DashboardOuter>
        <h3 className='dashboard-heading'>Hello <strong>{admin.name}</strong>, Welcome to Admin Dashboard.</h3>
        <hr/>
        <DashboardInner>
            <Card>
                <div className='card-text'>
                    <p>{users && users.length}</p>
                    <p>Registered Users</p>
                </div>
                <div className='icon'><FaUserFriends/></div>
            </Card>
            <Card>
                <div className='card-text'>
                    <p>100</p>
                    <p>Daily Views</p>
                </div>
                <div className='icon'><FaEye/></div>
            </Card>
            <Card>
                <div className='card-text'>
                    <p>{allOrders && deliveredOrders}</p>
                    <p>Orders Delivered so far</p>
                </div>
                <div className='icon'><FaGift/></div>
            </Card>
            <Card>
                <div className='card-text stockDetails'>
                    <div>
                        <p>{inStock}</p>    
                        <p>Books in Stock</p>
                    </div>
                    <div>
                        <p>{outOfStock}</p>
                        <p>Books out of Stock</p>
                    </div>
                    
                </div>
                <div className='icon'><FaBook/></div>
            </Card>
            <div className='graphs-div-outer'>
                
                <div className='graphs-div'>
                   <div className='graphs'>
                    <div>
                        <h3 >Revenue Generated Per Month </h3>
                    </div>   
                    {/* <img src={require("./sales_image.png")} alt="Sales " /> */}
                    <div> 
                        <Bar
                         data={ {
                            labels:months,
                            datasets: [
                              {
                                label: 'Amount',
                                fill: true,
                                lineTension: 0.5,
                                backgroundColor: bgColorArrayForRevenueGenerated,
                                borderWidth: 1,
                                data: revenueGeneratedPerMonth
                              }
                            ]
                        }}
                        options = {{
                            responsive: true,
                            maintainAspectRatio:false,  
                            plugins: charTitleForRevenueGenerated,
                            legend:{
                              display:true,
                              position:'right'
                            },
                            scales: {
                                x: xAxis,
                                y: yAxisForRevenueGenerated
                            }
                          }} 
                          height={300}
                          width={350}
                        />
                    </div>
                    </div> 
                      {/*2nd  */}
                   <div className='graphs'>
                    <div>
                        <h3 >Number of orders per month so far</h3>
                    </div>
                    <div>
                    <Pie
                    data={
                        {
                            labels: months,
                            datasets: [
                            {
                                label: 'Orders Placed',
                                fill: false,
                                // lineTension: 0.5,
                                backgroundColor: bgColorArray,
                                borderWidth: 1,
                                data: noOfOrders
                            }
                            ]
                        }
                    }
                    height={300}
                    width={350}
                    options={{
                        responsive: true,
                        // plugins: charTitle,
                       maintainAspectRatio:false,  
                       legend:{
                         display:true,
                         position:'right'
                       },

                     }}
                    
                    />
                    </div>
                </div>

                   {/*3rd  */}
                   <div className='graphs'>
                    <div>
                        <h3>Stock</h3>
                    </div>
                    <div>
                    <Doughnut
                    data={
                        {
                            labels: ["In Stock", "Out of Stock"],
                            datasets: [
                            {
                                fill: false,
                                // lineTension: 0.5,
                                backgroundColor: bgColorArray,
                                borderWidth: 1,
                                data: [inStock, outOfStock]
                            }
                            ]
                        }
                    }
                    height={300}
                    width={350}
                    options={{
                        responsive: true,
                        // plugins: charTitle,
                       maintainAspectRatio:false,  
                       legend:{
                         display:true,
                         position:'center'
                       },

                     }}
                    
                    />
                    </div>
                </div>
            
            </div> 
          </div>        
        </DashboardInner>

    </DashboardOuter>
  )
}

const DashboardOuter = styled.div`
    /* display: flex; */
    background-color: #f7f7f7;
    height: auto;
    box-shadow: 2px 4px 4px 1px #00000036;
    /* text-align: center; */
    padding-bottom: 1rem;
    padding-top: 1rem;
    padding: auto auto;
    .dashboard-heading{
        text-align: center;
        margin-bottom:0.8rem ;
        font-weight: 500;
        @media (max-width:650px){
            font-size: 0.9rem;
        }
        @media (max-width:360px){
            font-size: 0.8rem;
        }

    }
    
`;
const DashboardInner = styled.div`
    display: flex;
    flex-wrap: wrap;
    /* justify-content: flex-start; */
    width:98%;
    margin:0 auto;
    margin-top:1rem;
    margin-bottom:1rem;

    .graphs-div{
        display:flex;
        justify-content: space-between;
        margin-top: 1rem;

        @media (max-width:650px){
            flex-direction: column;
        }
    }

    .graphs-div-outer{
        width: 100%;
        margin: 0 auto;
        margin-top: 1rem;
        h3{
            padding: 5px;
            text-align: center;
            background: grey;
            color: white;
            @media (max-width:650px){
                font-size: 0.8rem;
            }
        }
    }
    .graphs{
        width:33%;
        @media (max-width:650px){
            width:100%;
        }
    }

    @media (max-width:1080px){
        justify-content: flex-start;
    }
    @media (max-width:950px){
        justify-content: flex-start;
    }
    @media (max-width:650px){
        width:100%;
        flex-direction: column;
    }
`;
const Card = styled.div`
    color: white;
    background: linear-gradient(85deg,#0000ffb3,#38dfd7d1);
    padding: 1.5rem 0.5rem;
    height:auto;
    width:20rem;
    border-radius:3px;
    overflow:hidden;
    position:relative;
    margin: 0 auto;
    display:flex;
    margin-bottom: 5px;
    @media (max-width:1250px){
        width:16rem;
    }
    @media (max-width:1000px){
        width:14rem;
    }
    @media (max-width:650px){
        margin-bottom:10px ;
        width:18rem;
    }
    .icon{
        width: 25%;
        font-size: 2.5rem;
        border: 1px solid darkcyan;
        border-radius: 50%;
        background: white;
        color:  #0000ffbd;
        padding: 5px 16px;
        @media (max-width:1000px){
            font-size: 2rem;
            padding: 5px 11px;
        }
        @media (max-width:650px){
            width: 20%;
            font-size: 1.5rem;
            padding: 8px 16px;
        }
    }
    svg{
        margin-top: 10px;
    }
    .card-text{
        width:75%;
        @media (max-width:650px){
            padding-left: 10px;
        }
    }
    .stockDetails{
        display: flex;
        justify-content: space-between;
        p{
            font-size:17px ;
        }
    }
    p{
        font-size: 20px;
        font-weight: 600;
        @media (max-width:1250px){
            font-size: 18px;
        }
        @media (max-width:1000px){
            font-size: 16px;
        }
        @media (max-width:650px){
            font-size: 15px;
        }
    }
    
`;
export default Dashboard