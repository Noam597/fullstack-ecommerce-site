import { Router} from 'express';
import { addNewItem, adminAddNewUser, 
         getAllUsers, 
         getBannedUsers, 
         getDailyOrderTotals, 
         toggleBanUserController, 
         updateProductPrice, 
         updateProductQuantity } from '../controller/admin.ts';
import { authToken } from '../middleware/jwtAuth.ts';
import { requireAdmin } from '../middleware/adminAuth.ts'


const adminRouter = Router()
//accounts Routes
adminRouter.post('/addNewUser',authToken, requireAdmin, adminAddNewUser);
adminRouter.post('/toggleBannedUser',authToken, requireAdmin, toggleBanUserController);
adminRouter.get("/fetchUsers",authToken, requireAdmin, getAllUsers)
adminRouter.get("/getBanned", authToken,requireAdmin,getBannedUsers)

  
 
//Inventory Routes
adminRouter.post('/addNewItem', authToken, requireAdmin,addNewItem)
adminRouter.post('/updatePrice',authToken, requireAdmin, updateProductPrice)
adminRouter.post('/updateQuantity', authToken, requireAdmin,updateProductQuantity)

//profit Routes

adminRouter.get("/orders/profits/daily",authToken, requireAdmin, getDailyOrderTotals)
export {adminRouter}