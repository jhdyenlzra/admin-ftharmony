export const userColumns = [
  { field: "id", headerName: "ID", width: 70 },
  {
    field: "user",
    headerName: "User",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img className="cellImg" src={params.row.img} alt="avatar" />
          {params.row.username}
        </div>
      );
    },
  },
  {
    field: "email",
    headerName: "Email",
    width: 230,
  },

  {
    field: "age",
    headerName: "Age",
    width: 100,
  },
  {
    field: "status",
    headerName: "Status",
    width: 160,
    renderCell: (params) => {
      return (
        <div className={`cellWithStatus ${params.row.status}`}>
          {params.row.status}
        </div>
      );
    },
  },
];

//temporary data
export const userRows = [
  {
    id: 1,
    username: "Chrislyn Lazara",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    status: "active",
    email: "random1@gmail.com",
    age: 42,
  },
  {
    id: 2,
    username: "Chastine Enolva",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "random2@gmail.com",
    status: "passive",
    age: 19,
  },
  {
    id: 3,
    username: "Mark Labucca",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "random3@gmail.com",
    status: "pending",
    age: 20,
  },
  {
    id: 4,
    username: "Johnray Gloria",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "random4@gmail.com",
    status: "active",
    age: 16,
  },
  {
    id: 5,
    username: "TEric Mandrique",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "random5@gmail.com",
    status: "passive",
    age: 22,
  },
  {
    id: 6,
    username: "Churt Santos",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "random6@gmail.com",
    status: "active",
    age: 15,
  },
  {
    id: 7,
    username: "Reyjohn Ebe",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "random7@gmail.com",
    status: "passive",
    age: 25,
  },
  {
    id: 8,
    username: "Josh Paclibar",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "random8@gmail.com",
    status: "active",
    age: 23,
  },
  {
    id: 9,
    username: "Jeriel Falla",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "random9@gmail.com",
    status: "pending",
    age: 22,
  },
  {
    id: 10,
    username: "Loryen Jhed",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "random10@gmail.com",
    status: "active",
    age: 21,
  },
];