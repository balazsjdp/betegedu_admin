import SimpleCard from "../ui-components/SimpleCard";



const Dashboard = () => {
    return ( 
        <div>
            <SimpleCard title="Összes megtekintés" preTitle="Posztok" body={<h1 style={{margin: 0}}>3</h1>} />
        </div>
     );
}
 
export default Dashboard;