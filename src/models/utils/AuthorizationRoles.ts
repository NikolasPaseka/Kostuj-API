export enum AuthorizationRoles {
    SUPER_ADMIN = 100,
    ADMIN = 200,
    WINERY = 300,
    USER = 400
}

export class AuthorizationManager {
    private roles: number[];

    constructor() {
        this.roles = Object.values(AuthorizationRoles).filter(value => typeof value === 'number') as number[];
    }

    isValidRole(role: number): boolean {
        return this.roles.includes(role);
    }

    prepareAuthorizations(authorizations: number[]): number[] {
        const parsedAuth = [...this.roles]
            .sort((a, b) => a - b)
            .filter(role => authorizations.includes(role));
        // Always include User role
        if (!parsedAuth.includes(AuthorizationRoles.USER)) {
            parsedAuth.push(AuthorizationRoles.USER);
        }
        return parsedAuth;
    }

    isSuperAdmin(authorizations: number[]): boolean {
        return authorizations.includes(AuthorizationRoles.SUPER_ADMIN);
    }

    isAdmin(authorizations: number[]): boolean {
        return authorizations.includes(AuthorizationRoles.ADMIN);
    }
}