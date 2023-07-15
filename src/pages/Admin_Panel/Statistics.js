import React, {useEffect,useState} from 'react';
import styled from "styled-components";
import { Order_Service } from '../../services/Service';
import { Bar, Line,Pie, Doughnut} from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
// defaults.global.legend.position = 'bottom'

function Statistics() {
    // const [allOrders, setAllorders] = useState([]);
    const [months, setMonths] = useState([]);
    const [noOfOrders, setNoOfOrders] = useState([]);
    // const [topFiveSellingBooks, setTopFiveSellingBooks ]=useState([]);
    const [topFiveSellingBookNames, setTopFiveSellingBookNames ]=useState([]);
    const [topFiveSellingBookQtys, setTopFiveSellingBookQtys ]=useState([]);
    const [revenueGeneratedPerMonth, setRevenueGeneratedPerMonth ]=useState([]);
    const [graphType, setGraphType] = useState("Doughnut");
    const [graphTypeForRevenue, setGraphTypeForRevenue] = useState("Line");
    // const [data,setData] =  useState({});

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
    let xAxisforTopFiveBooks = {
      display: true,
      title: {
        display: true,
        text: 'Books',
        color: '#612',
        font: {
          family: 'Comic Sans MS',
          size: 18,
          weight: 'bold',
          lineHeight: 1.2,
        },
        padding: {top: 10, left: 0, right: 0, bottom: 0}
      }
    }
    let yAxisforTopFiveBooks = {
      min: 0,
      max: 10,
      beginAtZero: true,
      display: true,
      title: {
      display: true,
      text: '# of Books Sold',
      color: '#350',
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
    let charTitle = {
        title: {
          display: true,
          text: 'Orders placed per month',
          font: {
            size: 16
          }
        }
    }
    let charTitleForTopFiveBooks = {
      title: {
        display: true,
        text: 'Top 5 most selling books',
        font: {
          size: 16
        }
      }
   }
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
    },
    title: {
      display: true,
      text: 'Revenue Generated Per Month',
      font: {
        size: 16
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
    let bgColorArrayForTop5books = [
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
        window.scrollTo(0,0);
        localStorage.removeItem("OrderId");
        if(user_admin && user_admin.role==="admin"){
            getAllOrders(user_admin.token); 
        }
        
    },[])
    
    const getAllOrders = async(token)=>{
        const response = await Order_Service.getAllOrders(token);
        if(response.status === 200){
            const returnedOrders = await response.json();
            // console.log(returnedOrders);
            let allBooks = []; 
            returnedOrders.forEach((item)=>{
              item.order.forEach((book)=>{
                allBooks.push(book);
              });
            });
            // console.log(allBooks);
            let uniqueBookWithQty = [];
            allBooks.forEach((item)=>{
              // if(item.book.book_name )
              let bookObj = {
                book_name: item.book.book_name,
                qty:item.quantity
              }
              uniqueBookWithQty.push(bookObj);
            })
            // console.log(uniqueBookWithQty);
            let booksSet = new Set([]);
            uniqueBookWithQty.forEach((item,index)=>{
              for(let i=index+1; i<uniqueBookWithQty.length; i++){
                if(item.book_name === uniqueBookWithQty[i].book_name){
                  item.qty +=uniqueBookWithQty[i].qty;
                  uniqueBookWithQty[i].qty=0; 
                }else {
                  continue;
                }
              }
              if(item.qty>0)
                booksSet.add(item);
            });
            let uniqueBooksArr = [...booksSet]; 
            // sort the array based on qty in decreasing order
            uniqueBooksArr.sort((a,b) => b.qty - a.qty);
            // console.log(uniqueBooksArr);
            // console.log(uniqueBooksArr.slice(0,5));

            // setTopFiveSellingBooks(uniqueBooksArr.slice(0,5));
            let bookNames=[];
            let qtys=[];
            uniqueBooksArr.slice(0,5).forEach((item)=>{
              bookNames.push(item.book_name);
              qtys.push(item.qty);
            })
            setTopFiveSellingBookNames(bookNames);
            setTopFiveSellingBookQtys(qtys);
           //converting set to array
            // setAllorders(returnedOrders);
            filterByDate(returnedOrders);
        }else if (response.status === 204){
            console.log("No orders found");
        }else {
            console.log("There was some error while fetching orders");
        }
    }
    const filterByDate = (orders)=>{
        let monthsSet = new Set([]);
        let numberOfOrderArr = [];
        
        let j=0;
        // for labels
        orders.forEach((order)=>{
            let date = new Date(order.date);
            let monthNumber = date.getMonth()+1;
            let month = convertToMonth(monthNumber);
            monthsSet.add(month);
        }); 
        let monthsArr = [...monthsSet]; 
           //converting set to array
        setMonths(monthsArr);
        let revenuePerMonth = [];
        // for data 
        [...Array(12)].forEach((order,index)=>{ 
          
            index=index+1;
            let count=0;    
            let found=false;
            let amt=0;
            for(let i=j; i<orders.length; i++){
                let date = new Date(orders[i].date);
                let monthNumber = date.getMonth()+1;
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
                    numberOfOrderArr[index-1]=count;
                    revenuePerMonth[index-1] = amt;
                    found = false;
                }
            }
        });
        // console.log("revenuePerMonth :",revenuePerMonth);
        setRevenueGeneratedPerMonth(revenuePerMonth);
        // console.log(numberOfOrderArr);
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
                break;
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
                break;
            default:
                month = "";
          }
          return month;
    }
    const handleGraphType = (e)=>{
        setGraphType(e.target.value);
        // console.log(e.target.value);
    }
    const handleGraphTypeForRevenue =(e)=>{
      setGraphTypeForRevenue(e.target.value);
    }
  return (
    <StatisticsOuter>
      <StatisticsInner>
          <h3 >Number of orders per month so far</h3>
      <div className='graph-type'>
        <label htmlFor="state"><strong>Choose Graph Type:</strong></label><br/>
        <select  
            className="form-control" 
            value={graphType  || ""} 
            onChange={handleGraphType}
            required>
                <option  defaultValue="Doughnut">Doughnut</option>
                <option  value="Bar">Bar</option>
                <option  value="Line">Line</option>
                <option  value="Area">Area</option>
                <option  value="Pie">Pie</option>
        </select><br/> 
      </div>

      <div>
      </div>
      
     {graphType === "Bar" && <div> 
        <Bar
          data={ {
            labels: months,
            datasets: [
              {
                label: 'Orders Placed',
                fill: true,
                lineTension: 0.5,
                backgroundColor: bgColorArray,
                borderWidth: 1,
                data: noOfOrders
              }
            ]
        }}
        options = {{
            responsive: true,
            maintainAspectRatio:false,  
            plugins: charTitle,
            legend:{
              display:true,
              position:'right'
            },
            scales: {
                x: xAxis,
                y: yAxis
            }
          }} 
          height={300}
          width={600}
        />
        </div>
        }

        {graphType === "Line" && <div>
         <Line
             data={
                {
                    labels: months,
                    datasets: [
                      {
                        label: 'Orders Placed',
                        fill: false,
                        lineTension: 0.5,
                        backgroundColor: bgColorArray,
                        borderWidth: 3,
                        borderColor: 'rgba(165,12,102,1)',
                        data: noOfOrders
                      }
                    ]
                  }
             }
             height={300}
             width={600}
             options={{
                responsive: true,
                hoverRadius:12,
               maintainAspectRatio:false,  
               plugins: charTitle,
               legend:{
                 display:true,
                 position:'right'
               },
               scales: {
                x: xAxis,
                y: yAxis
                }
             }}
             
           />
   
           </div>
           }
            {graphType === "Area" && <div>
          <Line
             data={
                {
                    labels: months,
                    datasets: [
                      {
                        label: 'Orders Placed',
                        fill: true,
                        lineTension: 0.5,
                        backgroundColor: bgColorArray,
                        borderWidth: 1,
                        data: noOfOrders
                      }
                    ]
                  }
             }
             height={300}
             width={600}
             options={{
                responsive: true,
                hoverRadius:12,
               maintainAspectRatio:false,  
               plugins: charTitle,
               legend:{
                 display:true,
                 position:'right'
               },
               scales: {
                x: xAxis,
                y: yAxis
                }
             }}
           />
           </div>
           }

           {graphType === "Pie" && <div>
         
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
             width={600}
             options={{
                responsive: true,
                plugins: charTitle,
               maintainAspectRatio:false,  
               legend:{
                 display:true,
                 position:'right'
               },
             }}
             
           />
   
           </div>
           }

        {graphType === "Doughnut" && <div>
         
         <Doughnut
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
             width={600}
             options={{
                responsive: true,
                plugins: charTitle,
               maintainAspectRatio:false,  
               legend:{
                 display:true,
                 position:'right'
               }
             }}
             
           />
   
           </div>
        }

    {/* Revenue generated per month */}
    <hr style={{height:'3px', backgroundColor:'orangered'}}/>
    
        <div className='five-most-selling'>
        
          <div>
            <h3>Revenue Generated Per Month</h3>
          </div>
          <div className='graph-type'>
            <label htmlFor="state"><strong>Choose Graph Type:</strong></label><br/>
            <select  
                className="form-control" 
                value={graphTypeForRevenue  || ""} 
                onChange={handleGraphTypeForRevenue}
                required>
                    <option  defaultValue="Line">Line</option>
                    <option  value="Bar">Bar</option>
            </select><br/> 
          </div>

       {graphTypeForRevenue === "Bar" &&  <div> 
        <Bar
          data={ {
            labels:months,
            datasets: [
              {
                label: 'Amount',
                fill: true,
                lineTension: 0.5,
                backgroundColor: bgColorArray,
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
          width={600}
        />
        </div>
       }
  {/* Line Graph */}
  {graphTypeForRevenue === "Line" &&  <div> 
        <Line
          data={ {
            labels:months,
            datasets: [
              {
                label: 'Amount',
                fill: false,
                lineTension: 0.5,
                backgroundColor: bgColorArray,
                borderWidth: 3,
                borderColor:'rgba(255,132,122,1)',
                data: revenueGeneratedPerMonth
              }
            ]
        }}
        options = {{
            hoverRadius:12,
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
          width={600}
        />
        </div>
       }

        </div>

        {/* Top 5 most selling books */}
        <hr style={{height:'3px', backgroundColor:'orangered'}}/>
        <div className='five-most-selling'>
        <div>
            <h3>Top Five Most Selling Books</h3>
          </div>

        <div> 
        <Bar
          data={ {
            labels:topFiveSellingBookNames,
            datasets: [
              {
                label: 'Books Sold',
                fill: true,
                lineTension: 0.5,
                backgroundColor: bgColorArrayForTop5books,
                borderWidth: 1,
                data: topFiveSellingBookQtys
              }
            ]
        }}
        options = {{
            responsive: true,
            maintainAspectRatio:false,  
            plugins: charTitleForTopFiveBooks,
            legend:{
              display:true,
              position:'right'
            },
            scales: {
                x: xAxisforTopFiveBooks,
                y: yAxisforTopFiveBooks
            }
          }} 
          height={300}
          width={600}
        />
       </div>
        </div>
      </StatisticsInner>
    </StatisticsOuter>
  )
}

const StatisticsOuter = styled.div`
    width:100%;
    height:100%;
    padding:10px;
`;

const StatisticsInner = styled.div`
    width:95%;

    @media (max-width:650px){
        width:100%;
    }
    h3{
        padding: 5px;
        background: grey;
        color: white;
        @media (max-width:650px){
            font-size: 0.8rem;
        }
    }

    .graph-type{
        width:20%;
        @media (max-width:650px){
            width:70%;
        }
    }
    .five-most-selling{
      margin-top:1rem;
    }

`;

export default Statistics
