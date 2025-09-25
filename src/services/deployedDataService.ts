import { ShipmentDetails, Activity } from '@/types/icp';
import { dealLogService } from './dealLogService';
import { MongoClient, ServerApiVersion, Db, ObjectId } from 'mongodb';
import { config } from '@/config';

export class DeployedDataService {
    private mongoClient: MongoClient;
    private mongoDb: Db | null = null;

    constructor() {
        // Initialize MongoDB client
        this.mongoClient = new MongoClient(config.databaseUrl, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
    }

    private async connect(): Promise<Db> {
        if (this.mongoDb) {
            return this.mongoDb;
        }

        try {
            console.log("Connecting to MongoDB...");
            await this.mongoClient.connect();
            this.mongoDb = this.mongoClient.db('prod');
            console.log("Connected to MongoDB successfully");
            return this.mongoDb;
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
            throw error;
        }
    }


    async getShipmentsList(): Promise<ShipmentDetails[]> {
        try {
            const db = await this.connect();
            const collection = db.collection('deals');

            console.log('Fetching shipments from MongoDB deals collection');

            const deals = await collection
                .find({ isPublished: true })
                .toArray();

            console.log(`Found ${deals.length} published deals`);

            // Convert deals to ShipmentDetails format
            const shipments = deals.map(deal => ({
                id: deal._id.toString(),
                status: deal.status || 'active',
                destination: deal.destination || '',
                expectedShippingEndDate: deal.expectedShippingEndDate || new Date().toISOString(),
                docs: deal.docs || [],
                quality: deal.quality || '',
                offerUnitPrice: deal.offerUnitPrice || 0,
                name: deal.name || '',
                origin: deal.origin || '',
                transport: deal.transport || '',
                vaultAddress: deal.vaultAddress || null,
                description: deal.description || '',
                investmentAmount: deal.investmentAmount || 0,
                portOfOrigin: deal.portOfOrigin || '',
                nftID: deal.nftID || 0,
                currentMilestone: deal.currentMilestone || 0,
                quantity: deal.quantity || 0,
                mintTxHash: deal.mintTxHash || '',
                presentation: deal.presentation || '',
                shippingStartDate: deal.shippingStartDate || new Date().toISOString(),
                variety: deal.variety || '',
                portOfDestination: deal.portOfDestination || '',
                milestones: deal.milestones || [],
            }));

            return shipments;
        } catch (error) {
            console.error('Error getting shipments from MongoDB:', error);
            throw error;
        }
    }

    async getShipmentDetails(id: string): Promise<ShipmentDetails> {
        try {
            const db = await this.connect();
            const collection = db.collection('deals');

            console.log('Fetching shipment details from MongoDB for ID:', id);

            const deal = await collection.findOne({
                _id: new ObjectId(id),
                isPublished: true
            });

            if (!deal) {
                throw new Error('Shipment not found');
            }

            console.log('Found deal:', JSON.stringify(deal, null, 2));

            // Convert deal to ShipmentDetails format
            const shipment: ShipmentDetails = {
                id: deal._id.toString(),
                status: deal.status || 'active',
                destination: deal.destination || '',
                expectedShippingEndDate: deal.expectedShippingEndDate || new Date().toISOString(),
                docs: deal.docs || [],
                quality: deal.quality || '',
                offerUnitPrice: deal.offerUnitPrice || 0,
                name: deal.name || '',
                origin: deal.origin || '',
                transport: deal.transport || '',
                vaultAddress: deal.vaultAddress || null,
                description: deal.description || '',
                investmentAmount: deal.investmentAmount || 0,
                portOfOrigin: deal.portOfOrigin || '',
                nftID: deal.nftID || 0,
                currentMilestone: deal.currentMilestone || 0,
                quantity: deal.quantity || 0,
                mintTxHash: deal.mintTxHash || '',
                presentation: deal.presentation || '',
                shippingStartDate: deal.shippingStartDate || new Date().toISOString(),
                variety: deal.variety || '',
                portOfDestination: deal.portOfDestination || '',
                milestones: deal.milestones || [],
            };

            return shipment;
        } catch (error) {
            console.error('Error getting shipment details from MongoDB:', error);
            throw error;
        }
    }

    async getShipmentActivity(id: number): Promise<Activity[]> {
        try {
            console.log('Fetching activities for shipment ID:', id);

            // Fetch deal logs from MongoDB using the string ID directly
            const dealLogs = await dealLogService.findDealLogsByShipmentId(id);

            // Convert deal logs to activity format
            const activities = dealLogService.convertToShipmentActivities(dealLogs);

            console.log(`Found ${activities.length} activities for shipment ${id}`);
            return activities;
        } catch (error) {
            console.error('Error getting shipment activity from MongoDB:', error);
            throw error;
        }
    }

}

export const deployedDataService = new DeployedDataService();
