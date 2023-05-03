import React from "react";
import { useState } from "react";

import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Grid,
    TextField,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";

export default function Home() {
    const [getMessage, setMessage] = useState("Loading...");

    const [getData, setData] = useState("Loading...");

    const [getSentiment, setSentiment] = useState("Unsure");

    const [getQuery, setQuery] = useState();

    const [getQueryData, setQueryData] = useState("Loading...");

    let ResponseInfo = () => {
        if (getData === "Loading...") {
            return (
                <Typography sx={{ color: "white" }}>Loading Data...</Typography>
            );
        } else {
            let name = formatIndexName(getData.database.name);

            return (
                <Grid
                    spacing={2}
                    direction="row">
                    <Grid item>
                        <Typography>{name}</Typography>
                    </Grid>
                    <Grid
                        item
                        sx={{ display: "flex" }}>
                        <Typography sx={{ marginRight: 1 }}>Status:</Typography>
                        <Typography color="secondary.light">
                            {getData.status.state}
                        </Typography>
                    </Grid>
                </Grid>
            );
        }
    };

    // formatIndexName
    // - Helper function, formats index name correctly
    function formatIndexName(indexName) {
        return indexName
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
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

            let indexData = resJSON.indexData;

            setData(indexData);
        } else {
            setMessage("Fetch error.");
        }
    }

    async function onGetQuery() {

        console.log("Sending: " + getQuery);

        let payload = {
            query: getQuery,
        };

        let JSONdata = JSON.stringify(payload);

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSONdata,
        };

        let endpoint = "/api/pinecone/query";

        let res = await fetch(endpoint, options);

        if (res) {
            let resJSON = await res.json();
            console.log(JSON.stringify(resJSON.message));
        } else {
            console.log("Error: ", req);
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
                    m: 5,
                }}>
                <Typography
                    variant="logo"
                    color="secondary">
                    FinAI
                </Typography>
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
                }}></Box>
            <Box>
                <Grid
                    direction={"column"}
                    alignItems={"center"}
                    container
                    rowSpacing={4}
                    columns={2}>
                    <Grid
                        item
                        sx={{ display: "flex", flexDirection: "column" }}>
                        <Grid
                            item
                            sx={{
                                marginTop: 4,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: 'center',
                                textAlign: 'left'
                            }}>
                            <Typography variant="subheader">
                                Database Status
                            </Typography>
                            <ResponseInfo />
                        </Grid>
                        <Button
                            variant="outlined"
                            sx={{
                                marginTop: 4,
                                width: "14rem",
                            }}
                            onClick={onGetStatus}>
                            Get Status
                        </Button>
                    </Grid>
                    <Grid
                        item
                        sx={{ display: "flex", flexDirection: "column" }}>
                        <TextField
                            sx={{ backgroundColor: "#676778", width: "100%" }}
                            variant="filled"
                            value={getQuery}
                            onChange={(e) => {
                                setQuery(e.target.value);
                            }}
                        />
                        <Button
                            variant="outlined"
                            sx={{
                                width: "100%",
                                marginTop: 2,
                            }}
                            onClick={onGetQuery}>
                            Get Query
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    m: 3,
                }}>
                <Card
                    sx={{
                        backgroundColor: "#1E90FF",
                        width: "40%",
                        p: 1,
                    }}>
                    <CardContent>
                        <Typography>Results</Typography>
                        <Typography>{getQueryData}</Typography>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}
