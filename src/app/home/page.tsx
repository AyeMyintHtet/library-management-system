"use client";
import React, { useEffect } from "react";
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import BookCard from "@/components/Card";
import ButtonAppBar from "@/components/Navbar";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import CircularProgress from '@mui/material/CircularProgress';
import Modal from "@mui/material/Modal";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Grid from "@mui/material/Grid";
import { IEntityBooks } from "../services/collection/book/IEntityBooks";
import { getLocalStorage } from "../utils";
import { useRouter } from "next/navigation";
import CrisisAlertIcon from '@mui/icons-material/CrisisAlert';

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

type TError = {
  bookNameError: boolean;
  bookDescriptionError: boolean;
};

export default function Home() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState<TError>({
    bookNameError: false,
    bookDescriptionError: false,
  });
  const [bookInfo, setBookInfo] = React.useState({
    bookName: "",
    bookDescription: "",
  });
  const [allBooks, setAllBooks] = React.useState([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [callApi,setCallApi] = React.useState<boolean>(false)
  const [borrowAmount,setBorrowAmount] = React.useState<number>(0)
  const user :any= localStorage.getItem('user');
  const userData = JSON.parse(user);
  if (!userData) return router.replace("/");

  useEffect(() => {
    fetchBook();
  }, []);

  useEffect(() => {
    fetchBook();
  }, [callApi]);

  async function fetchBook() {
    setLoading(true);
    fetch("/api/book").then(async (res) => {
      const data = await res.json();
      setAllBooks(data);
      if(userData !== 'librian'){
        let borrowAmount = 0;
        data.length > 0 && data.map((book : IEntityBooks)=>{
          if(book.aldyBorrowed !== "" && book.aldyBorrowed === userData.fullName) {
            borrowAmount += 1;
          }
        })
        setBorrowAmount(borrowAmount);
      }
    });
    setLoading(false);
  }
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (data.get("bookName") === "") {
      return setError((prev) => ({ ...prev, bookNameError: true }));
    }
    if (data.get("bookDescription") === "") {
      return setError((prev) => ({ ...prev, bookDescriptionError: true }));
    }

    if (error.bookNameError || error.bookDescriptionError) {
      return;
    }
    const obj: IEntityBooks = {
      bookName: data.get("bookName") as string,
      bookDescription: data.get("bookDescription") as string,
      aldyBorrowed: "" as string,
    };
    await fetch("/api/book", {
      method: "POST",
      body: JSON.stringify(obj),
    }).then((response) => {
      if (response.status === 200) {
        fetchBook();
        handleClose();
        setBookInfo({ bookName: "", bookDescription: "" });
      }
    });
  };

  const ErrorHandler = (from: "bookDescription" | "bookName", data: any) => {
    if (from === "bookName") {
      setBookInfo((prev) => ({ ...prev, bookName: data }));
      setError((prev) => ({
        ...prev,
        bookNameError: data.length > 0 ? false : true,
      }));
    } else {
      setBookInfo((prev) => ({ ...prev, bookDescription: data }));
      setError((prev) => ({
        ...prev,
        bookDescriptionError: data.length > 0 ? false : true,
      }));
    }
  };

  return (
    <>
      <ButtonAppBar />
      
      {
        userData === 'librian' &&
      <div className="m-3 d-flex justify-content-end align-items-center">
        <Button variant="contained" onClick={handleOpen}>
          Add Book
        </Button>
      </div>
      }
      <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">


      { userData === 'librian' ? 'Welcom To Your Admin Dashboard!' : `Dear  ${userData.fullName}, Welcome to the Books Store!`}
    </Alert>
    {
      loading &&
      <Box sx={{ display: 'flex',justifyContent:'center',alignItems:'center',height:'50vh' }}>
      <CircularProgress />
    </Box>
    }
    {
      !loading &&
      <div className="container">
        <div className="row">
          {allBooks.length > 0 ? allBooks.map((book: IEntityBooks) => (
            <div className="col-md-4" key={book._id}>
              <BookCard
                id={book._id?.toString()}
                bookName={book.bookName}
                bookDescription={book.bookDescription}
                aldyBorrowed={book.aldyBorrowed}
                user={userData.fullName}
                callApi={setCallApi}
                borrowAmount={borrowAmount}
              />
            </div>
          )) :
        <div className="container">
          <div className="d-flex flex-column gap-4 justify-content-center align-items-center w-100 mt-5">
      <CrisisAlertIcon/>
      <h1>No Book Here</h1>
          </div>
        </div>
        }
        </div>
      </div>
    }

      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              Add Book
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                error={error.bookNameError}
                margin="normal"
                required
                fullWidth
                id="bookName"
                label="Book Name"
                name="bookName"
                value={bookInfo.bookName}
                autoComplete="bookName"
                autoFocus
                onChange={(e) => ErrorHandler("bookName", e.target.value)}
                helperText={error.bookNameError && "You must enter Book Name"}
              />
              <TextField
                error={error.bookDescriptionError}
                margin="normal"
                required
                fullWidth
                value={bookInfo.bookDescription}
                name="bookDescription"
                label="Book Description"
                id="bookDescription"
                onChange={(e) =>
                  ErrorHandler("bookDescription", e.target.value)
                }
                helperText={
                  error.bookDescriptionError &&
                  "You must enter Book Description"
                }
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Add Book
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
