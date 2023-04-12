import React from "react";
import { useState } from "react";

import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Grid,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";

export default function Home() {
    const [getMessage, setMessage] = useState("Loading...");
    const [getData, setData] = useState("Loading...");
    const [getSentiment, setSentiment] = useState("Unsure");

    let ResponseInfo = () => {
        if (getData === "Loading...") {
            return (
                <Typography sx={{ color: "white" }}>Loading Data...</Typography>
            );
        } else {
            let name = formatIndexName(getData.database.name);

            return (
                <Grid spacing={2} direction="row">
                    <Grid item>
                        <Typography>{name}</Typography>
                    </Grid>
                    <Grid item sx={{display: "flex"}}>
                        <Typography sx={{marginRight: 1}}>Status:</Typography>
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
                    m: 5
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
                }}>
                <Button
                    variant="outlined"
                    sx={{
                        width: "40%",
                        m: 3,
                        marginTop: 4
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
                <Card
                    sx={{
                        backgroundColor: "#1E90FF",
                        width: "75%",
                        p: 1
                    }}>
                    <CardContent>
                        <Typography variant="subheader">
                            Database Status
                        </Typography>
                        <ResponseInfo />
                    </CardContent>
                </Card>
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
                        width: "75%",
                        p: 1
                    }}>
                    <CardContent>
                        <Grid sx={{display: "flex", direction: "column"}}>
                            <Grid item xs={6} sx={{m: 1}}>
                                <Typography variant="subheader">
                                    Current Market Sentiment
                                </Typography>
                                <Typography color="secondary.light">
                                    {getSentiment}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sx={{m: 1}}>
                                <Typography variant="subheader">
                                    Twitter Bot Status
                                </Typography>
                                <Typography color="secondary.light">
                                    {getSentiment}
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}
