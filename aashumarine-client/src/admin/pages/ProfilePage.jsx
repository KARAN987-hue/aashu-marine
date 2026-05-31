/**
 * ProfilePage Component
 * 
 * Admin profile page for viewing and editing user profile.
 * Displays user information and provides password change functionality.
 * 
 * Requirements: 33.1, 33.2, 33.3, 33.4, 33.5, 33.6, 33.7
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { authService } from '../services/authService';
import { PasswordChangeForm } from '../components/forms/PasswordChangeForm';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import './ProfilePage.css';

export function ProfilePage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const data = await authService.getProfile();
      setProfileData(data);
    } catch (error) {
      showToast(error.message || 'Failed to load profile', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (passwordData) => {
    try {
      await authService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      showToast('Password changed successfully', 'success');
      setShowPasswordForm(false);
    } catch (error) {
      showToast(error.message || 'Failed to change password', 'error');
      throw error; // Re-throw to let form handle it
    }
  };

  if (isLoading) {
    return (
      <div className="profile-page">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="profile-page">
      <header className="profile-header">
        <h1>Profile</h1>
      </header>

      <div className="profile-content">
        <section className="profile-info-section" aria-labelledby="user-info-heading">
          <h2 id="user-info-heading">User Information</h2>
          <div className="profile-info">
            <div className="profile-info-item">
              <label>Username:</label>
              <span>{profileData?.username || user?.username || 'N/A'}</span>
            </div>
            <div className="profile-info-item">
              <label>Email:</label>
              <span>{profileData?.email || user?.email || 'N/A'}</span>
            </div>
            <div className="profile-info-item">
              <label>Role:</label>
              <span className="profile-role">
                {profileData?.role || user?.role || 'N/A'}
              </span>
            </div>
          </div>
        </section>

        <section className="profile-password-section" aria-labelledby="password-heading">
          <div className="profile-password-header">
            <h2 id="password-heading">Change Password</h2>
            {!showPasswordForm && (
              <button
                className="btn-change-password"
                onClick={() => setShowPasswordForm(true)}
                aria-label="Show password change form"
              >
                Change Password
              </button>
            )}
          </div>

          {showPasswordForm && (
            <div className="profile-password-form">
              <PasswordChangeForm
                onSubmit={handlePasswordChange}
                onCancel={() => setShowPasswordForm(false)}
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default ProfilePage;
