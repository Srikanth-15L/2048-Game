import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'screens/home/home_screen.dart';
import 'screens/upload/upload_screen.dart';
import 'screens/history/history_screen.dart';
import 'screens/recommendations/recommendations_screen.dart';
import 'screens/profile/profile_screen.dart';
import 'screens/help/help_screen.dart';

GoRouter createRouter() {
  return GoRouter(
    initialLocation: '/home',
    routes: [
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) {
          return Scaffold(
            body: navigationShell,
            bottomNavigationBar: NavigationBar(
              selectedIndex: navigationShell.currentIndex,
              onDestinationSelected: navigationShell.goBranch,
              destinations: const [
                NavigationDestination(icon: Icon(Icons.home), label: 'Home'),
                NavigationDestination(icon: Icon(Icons.cloud_upload), label: 'Upload'),
                NavigationDestination(icon: Icon(Icons.history), label: 'History'),
                NavigationDestination(icon: Icon(Icons.recommend), label: 'Recs'),
                NavigationDestination(icon: Icon(Icons.person), label: 'Profile'),
                // Help accessible via profile or overflow
              ],
            ),
          );
        },
        branches: [
          StatefulShellBranch(routes: [GoRoute(path: '/home', builder: (c, s) => const HomeScreen())]),
          StatefulShellBranch(routes: [GoRoute(path: '/upload', builder: (c, s) => const UploadScreen())]),
          StatefulShellBranch(routes: [GoRoute(path: '/history', builder: (c, s) => const HistoryScreen())]),
          StatefulShellBranch(routes: [GoRoute(path: '/recommendations', builder: (c, s) => const RecommendationsScreen())]),
          StatefulShellBranch(routes: [GoRoute(path: '/profile', builder: (c, s) => const ProfileScreen())]),
        ],
      ),
      GoRoute(path: '/help', builder: (c, s) => const HelpScreen()),
    ],
  );
}