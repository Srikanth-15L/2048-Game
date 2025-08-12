import 'package:flutter/material.dart';

class HelpScreen extends StatelessWidget {
  const HelpScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Help & Support')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          ListTile(
            title: Text('FAQ'),
            subtitle: Text('Common questions about detection, usage and privacy'),
          ),
          ListTile(
            title: Text('Contact Agronomist'),
            subtitle: Text('Reach out for expert guidance'),
          ),
          ListTile(
            title: Text('Emergency Support'),
            subtitle: Text('Call local extension officer'),
          ),
        ],
      ),
    );
  }
}