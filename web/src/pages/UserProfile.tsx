import { useEffect, useState } from "react";
import { fetchProfile, ProfileData } from "../services/fetchers";
import { useAuth } from "../context/AuthContext"



const UserProfile = () => {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            const result = await fetchProfile(token);
            if (result.success && result.data) {
                setProfile(result.data);
            }

            setLoading(false);
        };

        fetchData();
        console.log("profile", profile)
    }, [token, profile]);

    if (loading) return <p>Loading...</p>;
    if (!profile) return <p>Could not load profile.</p>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">My Profile</h2>

            <p><span className="font-semibold">Username:</span> {profile.username}</p>
            <p><span className="font-semibold">Email:</span> {profile.email}</p>
            <p><span className="font-semibold">Role:</span> {profile.role}</p>
            <p><span className="font-semibold">User ID:</span> {profile._id}</p>

            <p className="text-sm text-gray-600 mt-4">
                Joined: {new Date(profile.createdAt).toLocaleDateString()}
            </p>
        </div>
    );
};

export default UserProfile;