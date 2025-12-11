type UserAPIRole = "manager" | "tender"

type UserAPIResponse = {
    user: {
        id_user: number;
        userFunction: UserAPIRole;
        name: string;
        email: string;
    }
}