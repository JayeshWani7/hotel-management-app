"use client";
import { useEffect, useState } from "react";
import { AppBar, Toolbar, IconButton, Badge, Button, TextField, MenuItem, Select, FormControl, InputLabel, Grid, Card, CardContent, CardMedia, Typography } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link } from "react-router-dom";
import Layout from "../../layouts/Layout"

// Static food data
const foodItems = [
  {
    id: 1,
    name: "Pizza Margherita",
    image: "/pizza.jpg", 
    price: 9.99,
    category: "Pizza",
    description: "A classic pizza with tomato, mozzarella, and basil.",
  },
  {
    id: 2,
    name: "Sushi Roll",
    image: "/sushi.jpg", 
    price: 12.99,
    category: "Sushi",
    description: "Fresh sushi rolls with salmon and avocado.",
  },
  {
    id: 3,
    name: "Burger",
    image: "/burger.jpg",
    price: 8.99,
    category: "Burger",
    description: "Juicy beef burger with lettuce, tomato, and cheese.",
  },
  {
    id: 4,
    name: "Pasta",
    image: "/pasta.jpg",
    price: 8.99,
    category: "Pasta",
    description: "White Sauce Pasta with lettuce, tomato, and cheese.",
  },
  {
    id: 5,
    name: "Veg Bowl",
    image: "/vegbowl.jpg",
    price: 13,
    category: "Bowl",
    description: "Juicy vegies  with lettuce, tomato and love.",
  },
  {
    id: 6,
    name: "Burger",
    image: "/burger.jpg",
    price: 8.99,
    category: "Burger",
    description: "Juicy beef burger with lettuce, tomato, and cheese.",
  },
];


export default function FoodList() {
    const [items, setItems] = useState(foodItems);
    const [cart, setCart] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [isCategoryActive, setIsCategoryActive] = useState(false);
  
    // Load the cart from localStorage if it exists
    useEffect(() => {
      const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCart(storedCart);
    }, []);
  
    // Add item to the cart
    const handleAddToCart = (item: any, quantity: number) => {
        const updatedCart = [...cart];
        const existingItemIndex = updatedCart.findIndex((cartItem) => cartItem.id === item.id);
    
        if (existingItemIndex !== -1) {
          updatedCart[existingItemIndex].quantity += quantity;
        } else {
          updatedCart.push({ ...item, quantity })
        }
    
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      };
  
    // Handle search and filter
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    };
  
    const handleCategoryChange = (event: React.ChangeEvent<{ value: unknown }>) => {
      setCategoryFilter(event.target.value as string);
    };
  
    // Filter items based on search term and category filter
    const filteredItems = items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (categoryFilter ? item.category === categoryFilter : true)
    );
  
    return (
      <Layout>
        {/* Utility Bar */}
        <AppBar position="sticky" sx={{ zIndex: 0, margin: 2,justifyContent:"space-between", backgroundColor: "#fff", color: "#000" }}>
      <Toolbar sx={{ justifyContent: "center" }}>
        {/* Home and Checkout Links */}
        <Button component={Link} to="/" color="inherit" sx={{ marginRight: 2 }}>
          Home
        </Button>
        <Button component={Link} to="/checkout" color="inherit" sx={{ marginRight: 2 }}>
          Checkout
        </Button>
        <Button component={Link} to="/food-orders" color="inherit" sx={{ marginRight: 2 }}>
          Order History
        </Button>

        {/* Search Bar */}
        <TextField
          variant="outlined"
          placeholder="Search for food..."
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{
            transition: "width 0.3s ease",
            width: isSearchActive ? "500px" : "200px", // Expand when focused
            marginRight: 2,
            "&:focus": {
              width: "200px", // Expand to this width when focused
            },
          }}
          size="small"
          onFocus={() => setIsSearchActive(true)}
          onBlur={() => setIsSearchActive(false)}
        />

        {/* Category Filter */}
        <FormControl
          sx={{
            minWidth: 120,
            marginLeft: 2,
            transition: "width 0.3s ease",
            width: isCategoryActive ? "150px" : "80px", // Expand when interacted
          }}
        >
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value as string)}
            label="Category"
            size="small"
            onOpen={() => setIsCategoryActive(true)}
            onClose={() => setIsCategoryActive(false)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Pizza">Pizza</MenuItem>
            <MenuItem value="Sushi">Sushi</MenuItem>
            <MenuItem value="Burger">Burger</MenuItem>
          </Select>
        </FormControl>

        {/* Cart Icon with Item Count */}
        <IconButton color="inherit" component={Link} to="/food-cart" sx={{ marginLeft: 2 }}>
          <Badge badgeContent={cart.reduce((total, item) => total + item.quantity, 0)} color="error">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  
        {/* Food List */}
        <main className="mx-auto mt-5 max-w-5xl px-4 py-12">
          <section className="grid items-center gap-8">
            <Grid container spacing={4}>
              {filteredItems.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <Card
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      minHeight: "400px", // Ensure equal height for all cards
                      height: "100%",
                      transition: "transform 0.3s ease-in-out",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      borderRadius: "10px",
                      overflow: "hidden",
                      "&:hover": {
                        transform: "scale(1.05)", // Hover effect for the whole card
                        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)", // Deeper shadow on hover
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={item.image}
                      alt={item.name}
                      sx={{
                        objectFit: "cover",
                        transition: "transform 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.1)", // Hover effect on the image
                        },
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1, padding: 2 }}>
                      <Typography variant="h6" component="div" sx={{ fontWeight: "bold", color: "#333" }}>
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
                        {item.description}
                      </Typography>
                      <Typography variant="h6" color="primary" sx={{ marginTop: 2, fontWeight: "bold" }}>
                        ${item.price}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{
                          mt: 2,
                          padding: "10px 0",
                          transition: "background-color 0.3s ease",
                          "&:hover": {
                            backgroundColor: "#3b82f6", // Hover effect on button
                          },
                          borderRadius: "8px",
                          fontWeight: "bold",
                        }}
                        onClick={() => handleAddToCart(item,1)}
                      >
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </section>
        </main>
      </Layout>
    );
  }