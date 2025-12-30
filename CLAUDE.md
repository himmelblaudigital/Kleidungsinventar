# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Kleidungsinventar** (Household Wardrobe Manager) - A React web application for managing clothing inventory for all household members. The goal is to maintain an overview of clothing items, avoid duplicate purchases, and track the condition of garments.

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Tech Stack

- **Framework**: React with Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide-React
- **Data Storage**: LocalStorage (initial version) or Supabase/Firebase for cloud sync

## Data Model

The application uses the following data structure:

### Person
- `id`: Unique identifier
- `name`: Person's name
- `avatar`: Profile image/icon
- `groesse`: Size information

### Kleidungsstück (Clothing Item)
- `id`: Unique identifier
- `personId`: Foreign key to Person
- `kategorie`: Category (T-Shirt, Hose/Pants, etc.)
- `farbe`: Color
- `marke`: Brand
- `status`: Current status (vorhanden/available, aussortiert/discarded, zu klein/too small)
- `bildURL`: Image URL

## Core Features

### Person Management
- Dashboard with overview of all household members
- Add new household members (name, profile picture/icon)
- Edit or delete member profiles

### Inventory Module (Core Functionality)
- List view showing all clothing items per person
- Filter/search by categories (e.g., "Show only winter jackets for Child A")
- Quick inventory: Toggle buttons to change status (e.g., "Still fits" → "Too small/Discard")
- Add item form: Capture new items (category dropdown, brand text field, photo upload placeholder)

### Statistics (Optional)
- Display summaries like "Person A has 12 T-shirts, 3 are too small"

## Component Structure

Expected component hierarchy:
- `Header`: Main navigation
- `PersonCard`: Display individual household member cards
- `InventoryTable`: List clothing items for a person
- `AddItemForm`: Modal/form for adding new clothing items

## UI/UX Flow

1. **Home**: Grid view of all household members
2. **Person Detail View**: Header with name + statistics, followed by clothing list
3. **Add-Item-Modal**: Simple popup for data entry

## Development Notes

- Design should be modern, light, and mobile-friendly
- All data persists to browser LocalStorage
- Use German language for UI labels and messages to match the target audience
