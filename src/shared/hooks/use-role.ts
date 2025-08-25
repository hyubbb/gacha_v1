import { useState, useEffect } from 'react';

export type UserRole = 'admin' | 'branch';

export function useRole() {
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [currentStore, setCurrentStore] = useState<string>('store-001');

  // 실제 구현에서는 로컬 스토리지나 API에서 사용자 정보를 가져올 수 있습니다
  useEffect(() => {
    const savedRole = localStorage.getItem('userRole') as UserRole;
    const savedStore = localStorage.getItem('currentStore');

    if (savedRole) {
      setUserRole(savedRole);
    }

    if (savedStore) {
      setCurrentStore(savedStore);
    }
  }, []);

  const updateRole = (role: UserRole) => {
    setUserRole(role);
    localStorage.setItem('userRole', role);
  };

  const updateStore = (store: string) => {
    setCurrentStore(store);
    localStorage.setItem('currentStore', store);
  };

  return {
    userRole,
    currentStore,
    updateRole,
    updateStore,
    isAdmin: userRole === 'admin',
    isBranch: userRole === 'branch'
  };
}
