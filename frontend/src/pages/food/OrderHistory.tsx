"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  Grid,
  IconButton,
  Button,
  Tooltip,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PrintIcon from "@mui/icons-material/Print";

/**
 * OrderHistoryTicket.tsx
 * Displays orders stored in localStorage as compact, ticket-like receipts.
 * - reads from localStorage key "orderHistory" (array of orders)
 * - each order: { id, date, items: [{ id, name, description?, price, quantity }] }
 * - provides Copy / Print / Remove actions
 */

export default function OrderHistoryTicket() {
  const [orderHistory, setOrderHistory] = useState<any[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("orderHistory") || "[]");
    setOrderHistory(stored);
  }, []);

  const removeOrder = (orderId: string | number) => {
    const filtered = orderHistory.filter((o) => o.id !== orderId);
    localStorage.setItem("orderHistory", JSON.stringify(filtered));
    setOrderHistory(filtered);
  };

  const copyOrder = (order: any) => {
    navigator.clipboard?.writeText?.(JSON.stringify(order, null, 2));
  };

  const printOrder = (order: any) => {
    const w = window.open("", "_blank", "noopener,noreferrer");
    if (!w) return;
    const html = `
      <html>
        <head>
          <title>Receipt ${order.id}</title>
          <style>
            body { font-family: monospace; padding: 20px; }
            .ticket { max-width: 380px; margin: 0 auto; border: 1px dashed #333; padding: 12px; }
            .row { display:flex; justify-content:space-between; margin:6px 0; }
            .center { text-align:center; }
            .small { font-size:12px; color:#555; }
            .total { font-weight:700; font-size:16px; margin-top:8px; }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="center"><strong>RECEIPT</strong></div>
            <div class="center small">Order #${order.id}</div>
            <div class="center small">${order.date}</div>
            <hr/>
            ${order.items
              .map(
                (it: any) => `
                <div class="row">
                  <div style="flex:1">${it.name}</div>
                  <div style="width:40px; text-align:center">${it.quantity}</div>
                  <div style="width:70px; text-align:right">${(it.price).toFixed(2)}</div>
                </div>
              `
              )
              .join("")}
            <hr/>
            <div class="row total">
              <div>Total</div>
              <div style="text-align:right">${order.items
                .reduce((s: number, it: any) => s + (it.price ?? 0) * (it.quantity ?? 1), 0)
                .toFixed(2)}</div>
            </div>
            <div class="center small" style="margin-top:10px">Thank you!</div>
          </div>
        </body>
      </html>
    `;
    w.document.write(html);
    w.document.close();
    w.print();
  };

  if (orderHistory.length === 0) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f7f7f8",
          p: 4,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          No orders placed yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#f3f4f6", minHeight: "100vh", py: 6 }}>
      <Box sx={{ minWidth: 1000, mx: "auto", px: 3 }}>
        <Typography
          variant="h4"
          align="center"
          sx={{
            mb: 4,
            fontWeight: 700,
            fontFamily: "ui-sans-serif, system-ui",
          }}
        >
          Order History
        </Typography>

        <Box sx={{ display: "grid", gap: 3 }}>
          {orderHistory.map((order) => {
            const total = order.items.reduce(
              (sum, it) => sum + (it.price ?? 0) * (it.quantity ?? 1),
              0
            );

            return (
              <Paper
                key={order.id}
                elevation={2}
                sx={{
                  overflow: "hidden",
                  mx: "auto",
                  maxWidth: 800,
                  borderRadius: 2,
                  border: "1px solid rgba(0,0,0,0.08)",
                  bgcolor: "background.paper",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
                }}
              >
                {/* top perforated header */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 2,
                    py: 1,
                    bgcolor: "#fafafa",
                    borderBottom: "1px dashed rgba(0,0,0,0.08)",
                  }}
                >
                  <Box>
                    <Typography sx={{ fontSize: 12, fontWeight: 800 }}>
                      RECEIPT
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
                      #{order.id}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
                      {order.date}
                    </Typography>
                  </Box>
                </Box>

                {/* body */}
                <Box sx={{ px: 3, py: 2 }}>
                  {/* table header */}
                  <Grid container sx={{ fontSize: 12, color: "text.secondary", mb: 1 }}>
                    <Grid item xs={5}>
                      Item
                    </Grid>
                    <Grid item xs={2} textAlign="center">
                      Qty
                    </Grid>
                    <Grid item xs={2} textAlign="right">
                      Price
                    </Grid>
                    <Grid item xs={3} textAlign="right">
                      Total
                    </Grid>
                  </Grid>

                  <Divider sx={{ borderStyle: "dashed", mb: 1 }} />

                  {/* items */}
                  {order.items.map((it) => (
                    <Grid
                      container
                      key={it.id}
                      alignItems="center"
                      sx={{
                        py: 1.5,
                        fontSize: 14,
                        color: "text.primary",
                        borderBottom: "1px solid #ddd",
                        marginBottom: "8px",
                        flexWrap: "nowrap", // Prevent wrapping of elements
                      }}
                    >
                      {/* Item Name & Description */}
                      <Grid item xs={5} sx={{ paddingRight: 2 }}>
                        <Typography sx={{ fontWeight: 600 }}>{it.name}</Typography>
                        {it.description && (
                          <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                            {it.description}
                          </Typography>
                        )}
                      </Grid>

                      {/* Item Price */}
                      <Grid item xs={2} sx={{ textAlign: "right" }}>
                        <Typography>₹ {it.price.toFixed(2)}</Typography>
                      </Grid>

                      {/* Item Quantity */}
                      <Grid item xs={2} sx={{ textAlign: "center" }}>
                        <Typography>× {it.quantity}</Typography>
                      </Grid>

                      {/* Item Total */}
                      <Grid item xs={3} sx={{ textAlign: "right" }}>
                        <Typography>
                          ₹ {((it.price ?? 0) * (it.quantity ?? 1)).toFixed(2)}
                        </Typography>
                      </Grid>
                    </Grid>
                  ))}
                </Box>

                <Divider />

                {/* totals */}
                <Box sx={{ px: 3, py: 1.5 }}>
                  <Grid container alignItems="center">
                    <Grid item xs={6}>
                      <Typography sx={{ fontSize: 13, color: "text.secondary" }}>Subtotal</Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="right">
                      <Typography sx={{ fontWeight: 700 }}>
                        ₹ {total.toFixed(2)}
                      </Typography>
                    </Grid>

                    {/* optional small fee row */}
                    <Grid item xs={6} sx={{ mt: 1 }}>
                      <Typography sx={{ fontSize: 11, color: "text.secondary" }}>Service fee</Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="right" sx={{ mt: 1 }}>
                      <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
                        ₹ 0.00
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                    </Grid>

                    <Grid item xs={6}>
                      <Typography sx={{ fontSize: 14, fontWeight: 800 }}>TOTAL</Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="right">
                      <Typography sx={{ fontSize: 14, fontWeight: 800 }}>
                        ₹ {total.toFixed(2)}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Box sx={{ textAlign: "center", mt: 1.5 }}>
                    <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
                      Thank you for your order
                    </Typography>
                  </Box>

                  {/* actions */}
                  <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, mt: 2 }}>
                    <Tooltip title="Copy order JSON">
                      <IconButton
                        size="small"
                        onClick={() => copyOrder(order)}
                        sx={{ border: "1px solid rgba(0,0,0,0.06)" }}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Print receipt">
                      <IconButton
                        size="small"
                        onClick={() => printOrder(order)}
                        sx={{ border: "1px solid rgba(0,0,0,0.06)" }}
                      >
                        <PrintIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Box sx={{ flex: 1 }} />

                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      startIcon={<DeleteOutlineIcon />}
                      onClick={() => removeOrder(order.id)}
                    >
                      Remove
                    </Button>
                  </Box>
                </Box>

                {/* bottom perforation visual */}
                <Box sx={{ height: 12, position: "relative" }}>
                  <Box
                    sx={{
                      position: "absolute",
                      left: -8,
                      top: -6,
                      width: 14,
                      height: 14,
                      bgcolor: "#f3f4f6",
                      borderRadius: "50%",
                      boxShadow: "inset 0 0 0 6px #fff",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      right: -8,
                      top: -6,
                      width: 14,
                      height: 14,
                      bgcolor: "#f3f4f6",
                      borderRadius: "50%",
                      boxShadow: "inset 0 0 0 6px #fff",
                    }}
                  />
                </Box>
              </Paper>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}