import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showSplitBill, setShowSplitBill] = useState(null);

  const [friends, setFriends] = useState(initialFriends);
  function handleShow() {
    setShowAddFriend(!showAddFriend);
  }

  function handleFriends(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  function handlerBills(friend) {
    setShowSplitBill((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function SplitBillaAdjust(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === showSplitBill.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setShowSplitBill(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friend={friends}
          handlerBills={handlerBills}
          showSplitBill={showSplitBill}
        />
        {showAddFriend && <AddFriend handleFriends={handleFriends} />}
        <Button onClick={handleShow}>
          {!showAddFriend ? "Add Friend" : "Close"}
        </Button>
      </div>

      {showSplitBill && (
        <SplitBill
          friendBills={showSplitBill}
          SplitBillaAdjust={SplitBillaAdjust}
        />
      )}
    </div>
  );
}

function FriendsList({ friend, handlerBills, showSplitBill }) {
  return (
    <ul>
      {friend.map((friends) => (
        <Friend
          friend={friends}
          key={friends.id}
          handlerBills={handlerBills}
          showSplitBill={showSplitBill}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, handlerBills, showSplitBill }) {
  const isSelected = friend.id === showSplitBill?.id;
  return (
    <li className="selected">
      <img src={friend.image} alt={friend.name}></img>
      <h3>{friend.name}</h3>
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {friend.balance}$
        </p>
      )}
      {friend.balance < 0 && (
        <p className="red">
          you owe {friend.name}
          {Math.abs(friend.balance)} $
        </p>
      )}

      {friend.balance === 0 && <p>you and {friend.name} are even</p>}

      <Button onClick={() => handlerBills(friend)}>
        {!isSelected ? "Select" : "Close"}
      </Button>
    </li>
  );
}

function AddFriend({ handleFriends }) {
  const [name, setName] = useState("");
  const [image, setImg] = useState("https://i.pravatar.cc/49");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriends = {
      name,
      image: `https://i.pravatar.cc/48?u=${id}`,
      id,
      balance: 0,
    };

    handleFriends(newFriends);
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👬 Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>
      <label>🎇 Image Url</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImg(e.target.value)}
      ></input>
      <Button>Add</Button>
    </form>
  );
}

function SplitBill({ friendBills, SplitBillaAdjust }) {
  const [Bill, SetBill] = useState("");
  const [PaidByUser, SetPaidByUser] = useState("");
  const [WhoPay, SetWhoPay] = useState("user");

  const FriendPay = Bill ? Bill - PaidByUser : "";

  function handleSplitBills(e) {
    e.preventDefault();
    if (!Bill || !PaidByUser) return;

    SplitBillaAdjust(WhoPay === "user" ? FriendPay : -PaidByUser);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSplitBills}>
      <h2>Split a bill with {friendBills.name}</h2>

      <label>💰 Bill Value</label>
      <input
        type="Number"
        value={Bill}
        onChange={(e) => SetBill(Number(e.target.value))}
      ></input>

      <label>🧍‍♀️ Your Expenses</label>
      <input
        type="number"
        value={PaidByUser}
        onChange={(e) => {
          const value = Number(e.target.value);
          if (value <= Bill) {
            SetPaidByUser(value);
          }
        }}
      />

      <label> 🕶{friendBills.name} expense</label>
      <input type="text" disabled value={FriendPay}></input>

      <label>🤑 Who is paying the bill</label>
      <select value={WhoPay} onChange={(e) => SetWhoPay(e.target.value)}>
        <option value="user">You</option>
        <option value={friendBills.name}>{friendBills.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
