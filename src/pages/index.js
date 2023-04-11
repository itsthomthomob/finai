import React from "react";
import { useState } from "react";

import { Box, Typography, Button } from "@mui/material";

export default function Home() {
    const [getMessage, setMessage] = useState("Loading...");
    const [getData, setData] = useState("Loading...");

    let ResponseInfo = () => {

      if(getData === "Loading..."){
        return ( 
          <Typography sx={{color: "white"}}>
            Loading Data...
          </Typography>
         );
      }
      else{
        return ( 
          <Box>
            <Typography>
              {getData.database.name}
            </Typography>
            <Typography>
              Status: 
            </Typography>
            <Typography>
              {getData.status.state}
            </Typography>
          </Box>
         );
      }

    }

    async function onGetStatus() {
        let payload = {};
        let JSONdata = JSON.stringify(payload);

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSONdata,
        };

        let endpoint = "/api/pinecone/initializeClient";

        let res = await fetch(endpoint, options);
        if (res) {
            let resJSON = await res.json();
            console.log(JSON.stringify(resJSON.message));

            setMessage(resJSON.message);

            let indexData = resJSON.indexData

            setData(indexData)

        } else {
            setMessage("Fetch error.");
        }
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
            }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <Typography variant="logo">FinAI</Typography>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <Typography variant="logoSubheader">
                    A financial analysis tool powerered by AI.
                </Typography>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <Button
                    sx={{
                        width: "25%",
                        m: 3,
                    }}
                    onClick={onGetStatus}>
                    Get Status
                </Button>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    m: 3,
                }}>
                <Typography
                    sx={{
                        textAlign: "center",
                    }}
                    variant="subheader">
                    {getMessage}
                </Typography>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    m: 3,
                }}>
                <ResponseInfo/>
            </Box>
        </Box>
    );
}
