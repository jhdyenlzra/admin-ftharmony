import "./table.scss";
import jeriel from "../../assets/jeriel.png"; // Corrected individual imports
import yen from "../../assets/yen.png";
import carl from "../../assets/carl.png";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const List = () => {

  const rows = [
    {
      id: 1021,
      img: jeriel,  // Store the image source, not JSX
      reporter: "Jeriel Falla",
      relationship: "Parent",
      reportedPerson: "Jane Doe",
      date: "5 September",
      status: "In-Review",
    },
    {
      id: 1022,
      img: yen,
      reporter: "Loryen Lazara",
      relationship: "Teacher",
      reportedPerson: "Michael Blue",
      date: "12 September",
      status: "Closed",
    },
    {
      id: 1023,
      img: carl,
      reporter: "Carl Daniel",
      relationship: "Neighbor",
      reportedPerson: "John Black",
      date: "15 September",
      status: "Pending",
    },
    // More cases can be added here...
  ];

  return (
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="tableCell">Tracking ID</TableCell>
            <TableCell className="tableCell">Reporter</TableCell>
            <TableCell className="tableCell">Relationship</TableCell>
            <TableCell className="tableCell">Reported Person</TableCell>
            <TableCell className="tableCell">Date</TableCell>
            <TableCell className="tableCell">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="tableCell">{row.id}</TableCell>
              <TableCell className="tableCell">
                <div className="cellWrapper">
                  <img src={row.img} alt="User Profile" className="image" /> {/* Image Rendering */}
                  {row.reporter}
                </div>
              </TableCell>
              <TableCell className="tableCell">{row.relationship}</TableCell>
              <TableCell className="tableCell">{row.reportedPerson}</TableCell>
              <TableCell className="tableCell">{row.date}</TableCell>
              <TableCell className="tableCell">
                <span className={`status ${row.status.toLowerCase()}`}>
                  {row.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default List;
