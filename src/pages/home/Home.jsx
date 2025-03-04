import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import "./home.scss"
import Widget from "../../components/widget/Widget"
import Featured from "../../components/featured/Featured"
import Chart from "../../components/chart/Chart"
import Table from "../../components/table/Table"

const Home = () => {
    return (
        <div className='home'>
            <Sidebar />
            <div className="homeContainer">
                <Navbar />
                <div className="widgets">
                    <Widget type="user" />
                    <Widget type="report" />
                </div>
                <div className="charts">
                    <Featured />
                    <Chart title="Last 1 year (Statistics)" aspect={2 / 1} />
                </div>
                <div className="listContainer">
                    <div className="listTitle">Latest Reports</div>
                    <Table />
                </div>
            </div>
        </div>
    )
}

export default Home