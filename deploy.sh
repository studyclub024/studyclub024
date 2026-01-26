#!/bin/bash

# Content Management System Deployment Script
# This script helps deploy all Firebase components

echo "🚀 StudyClub24 Content Management System Deployment"
echo "=================================================="
echo ""

# Function to display menu
show_menu() {
    echo "Select deployment option:"
    echo "1) Deploy Firestore Rules"
    echo "2) Deploy Storage Rules"
    echo "3) Deploy Both Rules"
    echo "4) Full Deploy (Hosting + Rules)"
    echo "5) Deploy Functions"
    echo "6) Build Only"
    echo "7) Exit"
    echo ""
}

# Function to deploy Firestore rules
deploy_firestore_rules() {
    echo "📦 Deploying Firestore security rules..."
    firebase deploy --only firestore:rules
    if [ $? -eq 0 ]; then
        echo "✅ Firestore rules deployed successfully!"
    else
        echo "❌ Firestore rules deployment failed!"
        exit 1
    fi
}

# Function to deploy Storage rules
deploy_storage_rules() {
    echo "📦 Deploying Storage security rules..."
    firebase deploy --only storage:rules
    if [ $? -eq 0 ]; then
        echo "✅ Storage rules deployed successfully!"
    else
        echo "❌ Storage rules deployment failed!"
        exit 1
    fi
}

# Function to build app
build_app() {
    echo "🔨 Building application..."
    npm run build
    if [ $? -eq 0 ]; then
        echo "✅ Build completed successfully!"
    else
        echo "❌ Build failed!"
        exit 1
    fi
}

# Function to deploy everything
full_deploy() {
    build_app
    echo ""
    echo "📦 Deploying to Firebase (hosting + rules)..."
    firebase deploy --only hosting,firestore:rules,storage:rules
    if [ $? -eq 0 ]; then
        echo "✅ Full deployment completed successfully!"
    else
        echo "❌ Deployment failed!"
        exit 1
    fi
}

# Function to deploy functions
deploy_functions() {
    echo "📦 Deploying Cloud Functions..."
    cd functions
    npm install
    cd ..
    firebase deploy --only functions
    if [ $? -eq 0 ]; then
        echo "✅ Functions deployed successfully!"
    else
        echo "❌ Functions deployment failed!"
        exit 1
    fi
}

# Main loop
while true; do
    show_menu
    read -p "Enter choice [1-7]: " choice
    echo ""
    
    case $choice in
        1)
            deploy_firestore_rules
            ;;
        2)
            deploy_storage_rules
            ;;
        3)
            deploy_firestore_rules
            echo ""
            deploy_storage_rules
            ;;
        4)
            full_deploy
            ;;
        5)
            deploy_functions
            ;;
        6)
            build_app
            ;;
        7)
            echo "👋 Goodbye!"
            exit 0
            ;;
        *)
            echo "❌ Invalid option. Please try again."
            ;;
    esac
    
    echo ""
    echo "=================================================="
    echo ""
done
