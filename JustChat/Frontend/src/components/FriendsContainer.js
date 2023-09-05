import { Box } from "@mui/system";
import { friendlistStyles, generalStyles } from "../styles/styles";
import Friend from "./Friend";
import { Typography } from "@mui/material";


export default function FriendsContainer({ friendList, handleRemove, onlineUsers }) {

   return (
      <Box {...friendlistStyles.friendsContainer} className="chats-container" >
         {friendList.length !== 0 ? friendList.map((friend, index) => (
            <Box {...friendlistStyles.friendContainer} key={friend._id}>
               <Friend
                  id={friend._id}
                  username={friend.username}
                  firstName={friend.firstName}
                  lastName={friend.lastName}
                  handleDelete={handleRemove}
                  onlineUsers={onlineUsers}
               />
            </Box>
         )) :
            <Box {...generalStyles.errorContainer}>
               <Typography variant='body1'>
                  Non hai ancora nessun amico
               </Typography>
            </Box>
         }
      </Box >
   )

}