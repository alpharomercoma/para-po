import { ProfilePageComponent } from "@/components/profile-page";
import { authOptions } from "@/server/auth";
import { db } from "@/db";
import { getServerSession } from "next-auth";
const session = await getServerSession(authOptions);
const savedTrips = await db.savedTrip.findMany({
    where: {
        createdById: session?.user.id,
    }
});

const userTrips = await db.userTrip.findMany({
    where: {
        createdById: session?.user.id,
    }
});

import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Profile | Para Po!",
};

const ProfilePage = () => {
    return (
        <ProfilePageComponent props={{
            savedTrips,
            userTrips
        }} />
    );
};

export default ProfilePage;