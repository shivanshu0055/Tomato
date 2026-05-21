import axios from 'axios'
import jwt from 'jsonwebtoken'
import getBuffer from '../config/datauri.js'
import { AuthenticatedRequest } from '../middlewares/isAuth.js'
import tryCatch from '../middlewares/tryCatch.js'
import { Restaurant } from '../model/Restaurant.js'

export const addRestaurant = tryCatch(async (req: AuthenticatedRequest, res) => {
    const user = req.user

    if (!user) {
        res.status(401).json({ message: 'Unauthorized' })
        return
    }

    const existingRestaurant = await Restaurant.findOne({ ownerId: user._id })

    if (existingRestaurant) {
        res.status(400).json({ message: 'You already have a restaurant' })
        return
    }

    const { name, description, phone, latitude, longitude, formattedAddress } = req.body

    if (!name || !phone || !latitude || !longitude) {
        res.status(400).json({ message: 'Please provide all required fields' })
        return
    }

    const file = req.file

    if (!file) {
        res.status(400).json({ message: 'Please upload an image' })
        return
    }

    const fileBuffer = getBuffer(file)

    if (!fileBuffer) {
        res.status(400).json({ message: 'Invalid image file' })
        return
    }

    const { data: uploadResult } = await axios.post(`${process.env.UTILS_BACKEND_URL}/api/upload`, {
        buffer: fileBuffer.content,
    })

    const newRestaurant = await Restaurant.create({
        name,
        description,
        image: uploadResult.url,
        phone,
        ownerId: user._id,
        autoLocation: {
            type: 'Point',
            coordinates: [Number(longitude), Number(latitude)],
            formattedAddress,
        },
    })

    res.status(201).json({ message: 'Restaurant created successfully', restaurant: newRestaurant })
})

export const fetchMyRestaurant = tryCatch(async (req: AuthenticatedRequest, res) => {
    const user = req.user

    if (!user) {
        res.status(401).json({ message: 'Unauthorized' })
        return
    }

    const restaurant = await Restaurant.findOne({ ownerId: user._id })

    if (!restaurant) {
        res.status(200).json({ restaurant: null, message: 'Restaurant not found' })
        return
    }

    if (!user.restaurantId) {
        const token = jwt.sign({ user: { ...user, restaurantId: restaurant._id } }, process.env.JWT_SECRET as string, {
            expiresIn: '15d',
        })

        res.status(200).json({ restaurant, token })
        return
    }

    res.status(200).json({ restaurant })
})

export const editRestaurant = tryCatch(async (req: AuthenticatedRequest, res) => {
    const user = req.user

    if (!user) {
        res.status(401).json({ message: 'Unauthorized' })
        return
    }

    const { name, description, phone } = req.body
    const file = req.file

    if (!file) {
        res.status(400).json({ message: 'Please upload an image' })
        return
    }

    const fileBuffer = getBuffer(file)

    if (!fileBuffer) {
        res.status(400).json({ message: 'Invalid image file' })
        return
    }

    const { data: uploadResult } = await axios.post(`${process.env.UTILS_BACKEND_URL}/api/upload`, {
        buffer: fileBuffer.content,
    })

    const updatedRestaurant = await Restaurant.findOneAndUpdate(
        { ownerId: user._id },
        {
            name,
            description,
            image: uploadResult.url,
            phone,
        },
        { new: true }
    )

    res.status(200).json({ message: 'Restaurant updated successfully', restaurant: updatedRestaurant })
})

export const toggleIsOpen = tryCatch(async (req: AuthenticatedRequest, res) => {
    const user = req.user

    if (!user) {
        res.status(401).json({ message: 'Unauthorized' })
        return
    }

    const restaurant = await Restaurant.findOne({ ownerId: user._id })

    if (!restaurant) {
        res.status(404).json({ message: 'Restaurant not found' })
        return
    }

    restaurant.isOpen = !restaurant.isOpen
    await restaurant.save()

    res.status(200).json({
        message: `Restaurant ${restaurant.isOpen ? 'opened' : 'closed'} successfully`,
        restaurant,
    })
})


export const getNearbyVerifiedRestaurants = tryCatch(async (req: AuthenticatedRequest, res) => {
    const { latitude, longitude, radius = '5000', search = '' } = req.query

    if (!latitude || !longitude) return res.status(400).json({ message: 'Latitude and longitude required' })

    const query: any = { isVerified: true }

    if (search && typeof search === 'string') {
        query.name = { $regex: search, $options: 'i' }
    }

    const lat = Number(latitude)
    const lng = Number(longitude)
    const maxDistance = Number(radius) // meters

    const results = await Restaurant.aggregate([
        {
            $geoNear: {
                near: { type: 'Point', coordinates: [lng, lat] },
                distanceField: 'distance',
                spherical: true,
                maxDistance,
                query,
            },
        },
        { $sort: { isOpen: -1, distance: 1 } },
        {
            $addFields: {
                distanceKm: { $round: [{ $divide: ['$distance', 1000] }, 2] },
            },
        },
    ])

    return res.json({ success: true, restaurants: results,count: results.length })
})

export const fetchSingleRestaurant=tryCatch(async(req:AuthenticatedRequest,res)=>{
    const {id}=req.params
    if(!id){
        res.status(400).json({message:'Restaurant id is required'})
        return
    }
    const restaurant=await Restaurant.findById(id)

    if(!restaurant){
        res.status(404).json({message:'Restaurant not found'})
        return
    }
    res.status(200).json({ restaurant })
})
